// Execution is owned by the Node Local Runtime, never a web request.
export async function POST() {
  return Response.json({ message: "聊天已升级，请刷新页面后使用新的会话接口。" }, { status: 410 });
}
