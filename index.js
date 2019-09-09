const server = require('./server.js');

const accountsRoutes = require('./Accounts/accountsRouter.js')

server.use('/api/accounts', accountsRoutes)

server.use('/', (req, res) => res.send('API is up...'))

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`\nListening on port ${PORT}...\n`);
});