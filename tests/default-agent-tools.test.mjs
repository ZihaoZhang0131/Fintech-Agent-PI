import assert from 'node:assert/strict';
import test from 'node:test';
import { createDefaultProjectAgentConfig } from '../lib/agent-profiles.ts';
import { resolveProjectAgentConfig } from '../server/agent/agent-registry.ts';
import { createProfileTools } from '../server/agent/profile-tools.ts';
import { registryFromSkills } from '../server/agent/skills/registry.ts';

test('default roles assemble actual tools with script execution limited to data role', async () => {
  const config = createDefaultProjectAgentConfig();
  const names = config.customSubAgents.flatMap(a => a.enabledSkills);
  const registry = registryFromSkills(names.map(name => ({name, description: name, content: 'test', origin: 'bundled', id: name, resources: []})));
  for (const profile of config.customSubAgents) {
    const { tools } = await createProfileTools({ profile, registry, workspaceId: 'test-workspace', approvalMode: 'ask', permissionMode: 'sandbox' });
    const actual = tools.map(tool => tool.name);
    assert.equal(actual.includes('run_skill_script'), profile.label === '数据Agent');
    assert.equal(actual.includes('python_analysis'), profile.label === '数据Agent');
    assert.equal(actual.includes('bash'), profile.label === '数据Agent');
    assert.equal(actual.includes('mutate_local_database'), profile.label === '数据Agent');
    assert.equal(actual.includes('generate_document'), profile.label === '写作Agent');
    assert.equal(actual.includes('render_kami_artifact'), profile.label === '写作Agent');
    assert.equal(actual.includes('web_search'), profile.label === '研报Agent');
  }
  assert.deepEqual(resolveProjectAgentConfig({}).customSubAgents, []);
  assert.deepEqual(resolveProjectAgentConfig({ ...config, customSubAgents: [] }).customSubAgents, []);
});

test('enabled search reports missing credentials without a network request', async () => {
  const { createWebSearchTool } = await import('../server/agent/tools/web-search.ts');
  const tool = createWebSearchTool({ apiKey: '' });
  await assert.rejects(() => tool.execute('test-call', { query: '测试查询' }), /TAVILY_API_KEY/);
});
