'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const Boom = require('boom');
const Path = require('path');

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

server.ext('onRequest', (request, reply) => {
  console.log('onRequest');
  reply.continue();
});

server.ext('onPreAuth', (request, reply) => {
  console.log('onPreAuth');
  reply.continue();
});

server.ext('onPostAuth', (request, reply) => {
  console.log('onPostAuth');
  reply.continue();
});

server.ext('onPreHandler', (request, reply) => {
  console.log('onPreHandler');
  reply.continue();
});

server.ext('onPostHandler', (request, reply) => {
  console.log('onPostHandler');
  reply.continue();
});

server.ext('onPreResponse', (request, reply) => {
  console.log('onPreResponse');
  reply.continue();
});


server.register([{
    register: require('good'),
    options: goodOptions
}, {
    register: require('inert'),
    options: {}
},{
    register: require('vision'),
    options: {}
}], err => {

  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    layout:true,
    path: 'views'
  });

  server.route({
    method:'GET',
    path:'/',
    handler: (request, reply) => {
      server.log('error', 'oh shit!');
      server.log('info', 'replying');
      console.log('handler');
      reply('hello hapi world');
    }
  });

  server.route({
    method:['POST', 'PUT'],
    path:'/post',
    config: {
      payload: {
        output: 'data',
        parse: false,
        allow: 'application/json'
      }
    },
    handler: (request, reply) => {
      reply(request.payload);
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

  server.route({
    method: 'GET',
    path: '/response',
    handler:(request, reply) => {
      reply('response object')
        .code(418)
        .type('text/plain')
        .header('hello', 'world')
        .state('CookieId', 'CookieValue');// set up cookies
    }
  });

  server.route({
    method:'GET',
    path:'/hapi.logo',
    handler: (request, reply) => {
      var path = Path.join(__dirname,'public/logo.svg');
      reply.file(path);
    }
  });

  server.route({
    method:'GET',
    path:'/assets/{files*}',
    handler: {
      directory: {
        path: Path.join(__dirname,'public')
      }
    }
  });

  server.route({
      method:'GET',
      path: '/page/{name?}',
      handler: (request, reply) => {
        reply.view('home', {name: request.params.name || 'World'});
      }
  });

  server.start(() => console.log(`started at: ${server.info.uri}`));

});
