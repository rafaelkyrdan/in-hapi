'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const Boom = require('boom');

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

  server.route({
    method: 'GET',
    path: '/error',
    handler:(request, reply) => {
      reply(new Error('oops'));
    }
  });

  server.route({
    method: 'GET',
    path: '/not-found',
    handler:(request, reply) => {
      reply(Boom.notFound());
    }
  });



  server.start(() => console.log(`started at: ${server.info.uri}`));

});
