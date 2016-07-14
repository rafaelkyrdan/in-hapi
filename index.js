'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection({
  host:'localhost',
  port:8000
});

let goodOptions = {
  reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{log: '*',response: '*'}]
      }, { module: 'good-console'}, 'stdout'
    ]
  }
};

server.register({
  register: require('good'),
  options: goodOptions
}, err => {

  server.route({
    method:'GET',
    path:'/',
    handler: (request, reply) => {
      server.log('error', 'oh shit!');
      server.log('info', 'replying');
      reply('hello hapi world');
    }
  });

  server.route({
    method:'GET',
    path:'/users/{userId}',
    handler:(request, reply) => {
      reply(request.params);
    }
  });

  server.route({
    method: 'GET',
    path: '/greeting/{name?}',
    handler:(request, reply) => {
      reply(`hello ${request.params.name}`);
    }
  });

  server.route({
    method: 'GET',
    path: '/files/{files*}',
    handler:(request, reply) => {
      reply(request.params);
    }
  });


  server.start(() => console.log(`started at: ${server.info.uri}`));

});
