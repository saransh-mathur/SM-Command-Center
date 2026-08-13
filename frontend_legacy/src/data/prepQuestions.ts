import { PREPQuestion } from '../types';

export const PREP_QUESTIONS: PREPQuestion[] = [
 {
 id: 'prep-1',
 type: 'PREP',
 category: 'Backend / Django',
 prompt: 'How do you optimize Django ORM queries to prevent the N+1 database problem in production?',
 sampleStructure: {
 pointOrSituation: 'Point: Use select_related() for single-valued foreign keys and prefetch_related() for many-to-many or reverse relations.',
 reasonOrTask: 'Reason: Without prefetching, iterating over related objects causes 1 initial query + N separate SQL queries, multiplying DB network latency by N.',
 exampleOrAction: 'Example: In an e-commerce order list, Order.objects.select_related("user").prefetch_related("items__product") collapses 500 DB queries into 2.',
 pointOrResult: 'Point: Always audit queries using django-debug-toolbar or assertNumQueries in automated test suites.'
 }
 },
 {
 id: 'prep-2',
 type: 'PREP',
 category: 'AI / RAG',
 prompt: 'How do you handle chunking and embedding retrieval quality in a production RAG pipeline?',
 sampleStructure: {
 pointOrSituation: 'Point: Use recursive character chunking with semantic overlap combined with hybrid dense-sparse vector search.',
 reasonOrTask: 'Reason: Fixed-token chunks break context across sentence boundaries, degrading cross-encoder reranking accuracy.',
 exampleOrAction: 'Example: In our legal doc QA pipeline, we used 512-token chunks with 64-token overlap + Cohere Rerank, boosting Top-3 precision from 64% to 89%.',
 pointOrResult: 'Point: Fine-tuning chunk size and adding a reranking step yields higher ROI than swapping baseline embedding models.'
 }
 },
 {
 id: 'prep-3',
 type: 'PREP',
 category: 'System Design',
 prompt: 'How would you design a distributed rate limiter for a multi-tenant API gateway?',
 sampleStructure: {
 pointOrSituation: 'Point: Implement a Sliding Window Counter algorithm backed by Redis clusters using atomic Lua scripts.',
 reasonOrTask: 'Reason: Fixed window algorithms suffer from burst traffic at boundary transitions, while Token Bucket requires state synchronization across nodes.',
 exampleOrAction: 'Example: Redis ZSET with timestamps as scores lets us count requests in [now - 60s, now] with ZREMRANGEBYSCORE and ZCARD in a single Lua execution.',
 pointOrResult: 'Point: This guarantees sub-millisecond overhead, memory efficiency, and eliminates race conditions across distributed workers.'
 }
 },
 {
 id: 'star-1',
 type: 'STAR',
 category: 'Behavioral / Leadership',
 prompt: 'Tell me about a time you had to resolve a high-severity production issue with incomplete information under tight deadlines.',
 sampleStructure: {
 pointOrSituation: 'Situation: During a major release at Lexlegis.ai, the document OCR vector ingestion pipeline stalled with memory leaks.',
 reasonOrTask: 'Task: As the backend engineer on call, I had to diagnose the bottle-neck without restarting the entire batch ingestion.',
 exampleOrAction: 'Action: I isolated the worker container using docker stats, traced memory growth with memory_profiler, discovered unclosed PDF file handles, patched the context manager, and hot-deployed the worker.',
 pointOrResult: 'Result: Ingestion recovered in 18 minutes with zero data loss, and I implemented an automated memory watchdog script to prevent recurrence.'
 }
 }
];
