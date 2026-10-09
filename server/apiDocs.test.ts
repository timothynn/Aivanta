import { describe, expect, it, vi } from 'vitest';
import { createApp } from './app';
import type { AppConfig } from './config';
import { InMemoryLeadStore } from './adapters/inMemoryLeadStore';

const config: AppConfig = { apiOrigin:'https://veyntis.vercel.app', aiVendor:'local', aiModel:'', geminiModel:'', openaiModel:'', retrievalMode:'keyword', embeddingModel:'', crmProvider:'none', leadNotificationFrom:'Veyntis <hello@example.com>', port:8787 };
const create = () => createApp({config,chatAssistant:{reply:vi.fn().mockResolvedValue({message:{role:'assistant',content:'Hello'}})},leadStore:new InMemoryLeadStore(),leadNotifier:{notifyLeadCreated:vi.fn().mockResolvedValue(undefined)}});

describe('public API explorer',()=>{
 it('serves a useful landing page at the root',async()=>{const app=await create();try {const res=await app.inject({method:'GET',url:'/'});expect(res.statusCode).toBe(200);expect(res.headers['content-type']).toContain('text/html');expect(res.body).toContain('/docs');}finally{await app.close();}});
 it('serves browsable API docs and an OpenAPI 3 specification',async()=>{const app=await create();try{const docs=await app.inject({method:'GET',url:'/docs'});const spec=await app.inject({method:'GET',url:'/openapi.json'});expect(docs.statusCode).toBe(200);expect(docs.body).toContain('swagger-ui');expect(spec.statusCode).toBe(200);expect(spec.json().openapi).toBe('3.0.3');expect(spec.json().paths['/api/leads'].post).toBeDefined();expect(spec.json().paths['/api/admin/leads'].get.security).toBeDefined();}finally{await app.close();}});
});
