export const createResSubscriber = res => ({
  next: success => { res.json({ success }) },
  error: error => { res.json({ error }) }
})
