const amqp = require('amqplib');
let channel;

async function connectBus(url) {
  try {
    const conn = await amqp.connect(url);
    channel = await conn.createChannel();
    await channel.assertExchange('domain_events', 'topic', { durable: true });
    console.log('RabbitMQ connected successfully');
    return channel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ, retrying in 5s...', error.message);
    return new Promise(resolve => setTimeout(() => resolve(connectBus(url)), 5000));
  }
}

function publish(event, payload, routingKey) {
  if (!channel) throw new Error('Channel not ready');
  const data = Buffer.from(JSON.stringify({ event, payload, ts: Date.now() }));
  channel.publish('domain_events', routingKey || event, data, { persistent: true });
}

async function subscribe(bindingKey, handler) {
  if (!channel) throw new Error('Channel not ready');
  const q = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(q.queue, 'domain_events', bindingKey);
  await channel.consume(q.queue, (msg) => {
    if (!msg) return;
    try {
      const { event, payload } = JSON.parse(msg.content.toString());
      handler({ event, payload });
      channel.ack(msg);
    } catch (e) {
      console.error('Handler error:', e);
      channel.nack(msg, false, false); // drop
    }
  });
}

module.exports = { connectBus, publish, subscribe };