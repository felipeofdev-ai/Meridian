import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '60s',
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<5000'],
    http_req_failed: ['rate<0.01']
  }
};

export default function () {
  const payload = JSON.stringify({ organization: 'acme', action: 'push', branch: 'main' });
  const res = http.post('http://localhost:8080/webhooks/gitlab', payload, {
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': 'acme',
      'X-Gitlab-Event': 'Push Hook',
      'X-Gitlab-Token': 'dev-gitlab-token'
    }
  });

  check(res, {
    accepted: (r) => r.status === 202
  });
  sleep(0.5);
}
