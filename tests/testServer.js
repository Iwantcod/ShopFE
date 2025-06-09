import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer();
// 기본 핸들러는 각 테스트 파일에서 server.use(rest.get(...)) 로 주입
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export { rest };
