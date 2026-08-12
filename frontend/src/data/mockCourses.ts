import { UdemyCourse, CourseCheatSheet } from '../types';

export const ACTIVE_UDEMY_COURSES: UdemyCourse[] = [
 {
 id: 'course-1',
 title: 'FastAPI & Microservices Architecture with Python',
 instructor: 'Jose Portilla / Tech Lead Academy',
 platform: 'Udemy',
 totalLessons: 84,
 completedLessons: 52,
 currentModule: 'Module 7: Asynchronous Background Tasks & Celery Workers',
 currentLessonTitle: 'Lecture 53: Implementing Redis Queue & Async Worker Pools',
 category: 'Backend',
 estimatedHoursLeft: 6.5,
 url: 'https://www.udemy.com/course/fastapi-microservices',
 },
 {
 id: 'course-2',
 title: 'Advanced Python Concurrency, AsyncIO & GIL Deep Dive',
 instructor: 'Fred Baptiste',
 platform: 'Udemy',
 totalLessons: 95,
 completedLessons: 68,
 currentModule: 'Module 9: Event Loops, Tasks & Futures Internals',
 currentLessonTitle: 'Lecture 69: Custom Task Scheduling and Exception Handling in AsyncIO',
 category: 'Backend',
 estimatedHoursLeft: 5.0,
 url: 'https://www.udemy.com/course/python-concurrency-asyncio',
 },
 {
 id: 'course-3',
 title: 'Docker & Kubernetes: The Practical DevOps Masterclass',
 instructor: 'Stephen Grider',
 platform: 'Udemy',
 totalLessons: 120,
 completedLessons: 45,
 currentModule: 'Section 8: Multi-Container Pods & Persistent Volumes',
 currentLessonTitle: 'Lecture 46: Configuring StatefulSets and Ingress Controllers',
 category: 'DevOps',
 estimatedHoursLeft: 12.0,
 url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide',
 },
 {
 id: 'course-4',
 title: 'PostgreSQL Deep Dive: Indexing, B-Trees & Query Tuning',
 instructor: 'Hussein Nasser',
 platform: 'Udemy',
 totalLessons: 62,
 completedLessons: 38,
 currentModule: 'Section 5: Index Scans vs Bitmap Index Scans & Vacuuming',
 currentLessonTitle: 'Lecture 39: EXPLAIN ANALYZE Breakdown & Cost Heuristics',
 category: 'System Design',
 estimatedHoursLeft: 4.5,
 url: 'https://www.udemy.com/course/postgresql-deep-dive',
 },
];

export const COURSE_CHEAT_SHEETS: CourseCheatSheet[] = [
 {
 id: 'sheet-1',
 topic: 'PostgreSQL Indexing & B-Tree Scans',
 category: 'Database Optimization',
 mentalModelBullets: [
 'B-Tree indexes provide $O(\\log N)$ lookup by maintaining a self-balancing sorted tree structure; ideal for equality (`=`) and range queries (`<`, `>`, `BETWEEN`).',
 'An Index Only Scan avoids reading the table heap entirely if all queried columns are in the index and the pages are marked all-visible in the visibility map.',
 'Bitmap Index Scans are chosen by the planner when multiple rows match: it builds a bitmap of page addresses in memory first, then reads disk pages sequentially to minimize random I/O.',
 ],
 codeChallenge: {
 title: 'Analyze Query Execution & Optimize Slow Join',
 prompt: 'Given a table `transactions (id, user_id, amount, created_at)`, write the composite index definition to optimize queries filtering by `user_id` and sorted by `created_at DESC`.',
 starterCode: `-- Write your composite index creation query below:\nCREATE INDEX idx_user_created ON transactions (\n -- add columns and order here\n);`,
 solution: `CREATE INDEX idx_user_created ON transactions (user_id, created_at DESC);`,
 },
 activeRecallQuestions: [
 'Why will PostgreSQL ignore a B-Tree index on `(last_name, first_name)` if the WHERE clause only filters by `first_name`?',
 'What is the trade-off between write amplification during `INSERT`/`UPDATE` and having multiple secondary indexes on high-frequency tables?',
 ],
 },
 {
 id: 'sheet-2',
 topic: 'AsyncIO Event Loop & Task Execution in Python',
 category: 'Python Concurrency',
 mentalModelBullets: [
 'AsyncIO uses cooperative multitasking on a single thread: coroutines yield control back to the event loop via `await`, allowing other ready tasks to execute during I/O wait.',
 '`asyncio.create_task()` immediately schedules a coroutine on the event loop concurrently, returning a Task object without blocking.',
 '`asyncio.gather()` aggregates multiple awaitables concurrently and preserves the result order, while `asyncio.as_completed()` yields results as each task finishes.',
 ],
 codeChallenge: {
 title: 'Execute Concurrent Web Requests with Timeout',
 prompt: 'Implement an async function `fetch_all(urls)` that runs multiple mock async fetches concurrently using `asyncio.gather()` with a timeout.',
 starterCode: `import asyncio\n\nasync def fetch_url(url: str) -> str:\n await asyncio.sleep(0.5)\n return f"Response from {url}"\n\nasync def fetch_all(urls: list[str]) -> list[str]:\n # Implement concurrent fetch using asyncio.gather\n pass`,
 solution: `import asyncio\n\nasync def fetch_url(url: str) -> str:\n await asyncio.sleep(0.5)\n return f"Response from {url}"\n\nasync def fetch_all(urls: list[str]) -> list[str]:\n tasks = [fetch_url(u) for u in urls]\n return await asyncio.gather(*tasks)`,
 },
 activeRecallQuestions: [
 'What happens if you run a CPU-bound `time.sleep(5)` or heavy mathematical loop inside an `async def` function in Python?',
 'How does `loop.run_in_executor()` allow CPU-intensive or blocking synchronous code to coexist with AsyncIO without freezing the event loop?',
 ],
 },
 {
 id: 'sheet-3',
 topic: 'FastAPI Dependency Injection & Middleware Lifecycle',
 category: 'API Architecture',
 mentalModelBullets: [
 'FastAPI Dependencies (`Depends()`) resolve a Directed Acyclic Graph (DAG) of sub-dependencies before executing the route handler, guaranteeing single-execution per request when cached.',
 '`yield` dependencies allow executing setup code before the request handler (e.g. acquiring a DB session) and automatic teardown cleanup after the response is returned.',
 'Middleware operates at the ASGI raw scope level, wrapping the entire HTTP request/response pipeline and enabling cross-cutting concerns like CORS, tracing, and rate limiting.',
 ],
 codeChallenge: {
 title: 'Create an Async Database Session Dependency with Yield',
 prompt: 'Write a dependency `get_db()` that yields an async session and ensures it is safely closed in a `finally` block.',
 starterCode: `from fastapi import Depends\nfrom typing import AsyncGenerator\n\nasync def get_db() -> AsyncGenerator:\n # Initialize session, yield it, and close in finally\n pass`,
 solution: `from fastapi import Depends\nfrom typing import AsyncGenerator\n\nasync def get_db() -> AsyncGenerator:\n db = await DatabasePool.acquire()\n try:\n yield db\n finally:\n await db.release()`,
 },
 activeRecallQuestions: [
 'Why is dependency injection preferable over global singleton database variables when writing unit tests with mock databases?',
 'How does FastAPI distinguish between query parameters and path parameters in endpoint signatures without explicit decorators?',
 ],
 },
];
