import http from 'k6/http';
import { check } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const loginRequestDuration = new Trend('login_request_duration');
const loginSuccessRate = new Rate('login_success_rate');

export const options = {
  stages: [
    { duration: '5s', target: 3 },
    { duration: '5s', target: 3 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<0.7'],
    login_request_duration: ['p(95)<3000'],
    login_success_rate: ['rate>0.9'],
  },
  discardResponseBodies: false,
};

export default function () {
  const startTime = new Date().getTime();
  
  const loginUrl = 'https://github.com/login';
  const response = http.get(loginUrl);
  
  const endTime = new Date().getTime();
  const duration = endTime - startTime;
  
  loginRequestDuration.add(duration);
  
  const success = check(response, {
    'login page loaded': (r) => r.status === 200,
    'response time acceptable': (r) => r.timings.duration < 5000,
  });
  
  loginSuccessRate.add(success);
}
