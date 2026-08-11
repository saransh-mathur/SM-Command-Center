import { DockerContainer } from '../types';

export const INITIAL_CONTAINERS: DockerContainer[] = [
  {
    id: 'c1',
    name: 'odysseus-worker',
    image: 'odysseus/agent-runtime:latest',
    status: 'running',
    port: '9000:9000',
    memoryUsage: '384 MB'
  },
  {
    id: 'c2',
    name: 'ollama-inference',
    image: 'ollama/ollama:latest',
    status: 'idle',
    port: '11434:11434',
    memoryUsage: '1.2 GB'
  },
  {
    id: 'c3',
    name: 'pgvector-db',
    image: 'ankane/pgvector:v0.5.1',
    status: 'running',
    port: '5432:5432',
    memoryUsage: '142 MB'
  },
  {
    id: 'c4',
    name: 'redis-cache',
    image: 'redis:7.2-alpine',
    status: 'running',
    port: '6379:6379',
    memoryUsage: '32 MB'
  }
];
