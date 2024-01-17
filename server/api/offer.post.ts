export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log({body});
  event.context?.appSocket.emit('offer', body.offer)

  return true
})