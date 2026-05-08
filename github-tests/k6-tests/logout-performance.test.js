import http from 'k6/http';
import { check } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const logoutRequestDuration = new Trend('logout_request_duration');
const logoutSuccessRate = new Rate('logout_success_rate');

export const options = {
  stages: [
    { duration: '5s', target: 3 },
    { duration: '5s', target: 3 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.7'],
    logout_request_duration: ['p(95)<2000'],
    logout_success_rate: ['rate>0.3'],
  },
  discardResponseBodies: false,
};

export default function () {
  const startTime = new Date().getTime();
  
  const logoutUrl = 'https://github.com/logout';
  const response = http.get(logoutUrl);
  
  const endTime = new Date().getTime();
  const duration = endTime - startTime;
  
  logoutRequestDuration.add(duration);
  
  const success = check(response, {
    'logout request processed': (r) => r.status === 302 || r.status === 200 || r.status === 404,
    'response time acceptable': (r) => r.timings.duration < 3000,
  });
  
  logoutSuccessRate.add(success);
}
