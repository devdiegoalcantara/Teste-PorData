import http from 'k6/http';
import { check } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const reposRequestDuration = new Trend('repositories_request_duration');
const reposSuccessRate = new Rate('repositories_success_rate');

export const options = {
  stages: [
    { duration: '5s', target: 3 },
    { duration: '5s', target: 3 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<4000'],
    http_req_failed: ['rate<0.7'],
    repositories_request_duration: ['p(95)<3000'],
    repositories_success_rate: ['rate>0.3'],
  },
  discardResponseBodies: false,
};

export default function () {
  const username = __ENV.GITHUB_USERNAME || 'github';
  const reposUrl = `https://github.com/${username}?tab=repositories`;
  
  const startTime = new Date().getTime();
  
  const response = http.get(reposUrl, {
    headers: {
      'User-Agent': 'k6-performance-test',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });
  
  const endTime = new Date().getTime();
  const duration = endTime - startTime;
  
  reposRequestDuration.add(duration);
  
  const success = check(response, {
    'repositories page loaded': (r) => r.status === 200,
    'response time acceptable': (r) => r.timings.duration < 4000,
    'contains repositories content': (r) => r.body && (r.body.includes('Repositories') || r.body.includes('repositories')),
  });
  
  reposSuccessRate.add(success);
}
