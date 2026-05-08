import http from 'k6/http';
import { check } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const loginRequestDuration = new Trend('login_request_duration');
const loginSuccessRate = new Rate('login_success_rate');
const reposRequestDuration = new Trend('repositories_request_duration');
const reposSuccessRate = new Rate('repositories_success_rate');
const logoutRequestDuration = new Trend('logout_request_duration');
const logoutSuccessRate = new Rate('logout_success_rate');

export const options = {
  stages: [
    { duration: '5s', target: 3 },
    { duration: '10s', target: 3 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<0.7'],
    login_request_duration: ['p(95)<3000'],
    login_success_rate: ['rate>0.9'],
    repositories_request_duration: ['p(95)<3000'],
    repositories_success_rate: ['rate>0.3'],
    logout_request_duration: ['p(95)<2000'],
    logout_success_rate: ['rate>0.3'],
  },
  discardResponseBodies: false,
};

export default function () {
  // Test 1: Login Page Performance
  const loginStartTime = new Date().getTime();
  const loginResponse = http.get('https://github.com/login');
  const loginEndTime = new Date().getTime();
  const loginDuration = loginEndTime - loginStartTime;
  
  loginRequestDuration.add(loginDuration);
  
  const loginSuccess = check(loginResponse, {
    'login page loaded': (r) => r.status === 200,
    'response time acceptable': (r) => r.timings.duration < 5000,
  });
  
  loginSuccessRate.add(loginSuccess);

  // Test 2: Repositories Page Performance
  const username = __ENV.GITHUB_USERNAME || 'github';
  const reposUrl = `https://github.com/${username}?tab=repositories`;
  
  const reposStartTime = new Date().getTime();
  const reposResponse = http.get(reposUrl, {
    headers: {
      'User-Agent': 'k6-performance-test',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });
  const reposEndTime = new Date().getTime();
  const reposDuration = reposEndTime - reposStartTime;
  
  reposRequestDuration.add(reposDuration);
  
  const reposSuccess = check(reposResponse, {
    'repositories page loaded': (r) => r.status === 200,
    'response time acceptable': (r) => r.timings.duration < 4000,
    'contains repositories content': (r) => r.body && (r.body.includes('Repositories') || r.body.includes('repositories')),
  });
  
  reposSuccessRate.add(reposSuccess);

  // Test 3: Logout Performance
  const logoutStartTime = new Date().getTime();
  const logoutResponse = http.get('https://github.com/logout');
  const logoutEndTime = new Date().getTime();
  const logoutDuration = logoutEndTime - logoutStartTime;
  
  logoutRequestDuration.add(logoutDuration);
  
  const logoutSuccess = check(logoutResponse, {
    'logout request processed': (r) => r.status === 302 || r.status === 200 || r.status === 404,
    'response time acceptable': (r) => r.timings.duration < 3000,
  });
  
  logoutSuccessRate.add(logoutSuccess);
}
