---
title: "Scaling microservices on Google Cloud Platform"
date: 2022-09-29T21:03:13+02:00
type: work
thumbnail: microservice.webp
skills: ["Google Cloud", "ASP.NET core", "RabbitMQ", "Kubernetes", "Redis"]
slug: microservices
introduction: "A high traffic social media platform built on microservices, using ASP.NET core, Redis, RabbitMQ and Kubernetes."
github: https://github.com/raycohaex/kwetter-microservice
---
## Context
During my semester of enterprise software engineering I chose to build a social media platform. Particularly because I was interested to build and scale a timeline of many posts combined so that every user has a personalized feed. I also wanted to learn more about microservices and how to scale them. There were some interesting system design challenges at hand like scaling a timeline where 3000 users made 50-150 posts within the span on 30 seconds. Each used also had between 1 and 300 followers.

## Architecture
Below is a basic overview of the architecture I built. Each service is composed using ASP.NET Core 6 webapi following either a CQRS based architecture or a layered one (depending on complexity of the service). For messaging I chose to use RabbitMQ because it fit the usecase well based on the fact that it wasn't sure where the architecture would end up and there was no non-functional requirement that would need streaming. Each service uses the MassTransit library to interact with RabbitMQ. I mostly used topic exchanges.
![Architecture](/rayco-website/microservice-architecture.jpg "Basic overview of the architecture")

### Post service
This service is build up using Command Query Responsibility Segregation (CQRS). MediatR is used to handle the commands and queries. The service is responsible for creating and deleting posts. It also has a query endpoint that returns a post by id. The database used for this service is MySQL. I also made a different Event Sourcing implementation where I used a read and write database. The read database being MySQL which contained the latest posts and the write database being MongoDB where it stored all the posts as events. This allowed me to have the ability to play back events thus creating eventual consistency.

### Timeline service
Following the non-functional requirements, I wanted to build a timeline that would show you posts of your followers at fast speeds, though new posts did not have to appear straight away.
\
\
To solve this problem I chose Redis as a data store for the timelines and used an event driven architecture to build up the timelines. A `KweetPostedEvent` is consumed by the timeline service through RabbitMQ. The timeline service then sends out a request-response to the social service also through RabbitMQ, this is fine because the operation will not affect any get requests to the timeline.

### Social service
This service is build up using a layered architecture. To store users and followers I used a graph database called Neo4j. I chose the graph datastructure because it easily allows to get closely related people, similar to LinkedIn showing 1de, 2de and 3de users. This service listened to the integration event from the auth service to create a new user. It also responds to the timeline service to get the followers of a user.
\
\
The consumer for creating a user node after a user is created in the auth service looks like this:


```csharp
// program.cs

builder.Services.AddMassTransit(config =>
{
    config.AddConsumer<RequestFollowersConsumer>();
    config.AddConsumer<RegisterEventConsumer>();
    config.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host(builder.Configuration["EventBusSettings:HostAddress"]);
        cfg.ReceiveEndpoint(EventBusConstants.GetRequestFollowersConsumer, c =>
        {
            c.ConfigureConsumer<RequestFollowersConsumer>(ctx);
        });

        cfg.ReceiveEndpoint(builder.Configuration["EventBusSettings:QueueName"], e =>
        {
            e.UseRawJsonDeserializer();
            e.Bind("amq.topic", x =>
            {
                // KK.EVENT.CLIENT.master.SUCCESS.kwetter-frontend.REGISTER
                x.RoutingKey = builder.Configuration["EventBusSettings:RoutingKey"]; 
                x.ExchangeType = "topic";
                }
            ) ;

            e.ConfigureConsumer<RegisterEventConsumer>(ctx);
        });
    });
});
```

____

```csharp
// RegisterEventConsumer.cs

public class RegisterEventConsumer : IConsumer<EventClientNotificationMqMsg>
{
    private readonly ILogger<RegisterEventConsumer> _logger;
    private readonly IFollowService _followService;

    public RegisterEventConsumer(ILogger<RegisterEventConsumer> logger, IFollowService followService)
    {
        _logger = logger;
        _followService = followService;
    }

    public async Task Consume(ConsumeContext<EventClientNotificationMqMsg> context)
    {
        var username = context.Message.Details.Username;
        var userId = context.Message.UserId;

        var id = new Guid(userId);
        var user = new UserDto { Id = id, UserName = username };

        try
        {
            await _followService.CreateUserNode(user);
        }
        catch(UserNodeCreationException e)
        {
            _logger.LogError($"Failed to create user {userId} as node. Reason: {e.Message}");
        }
    }
}
```

## Google Cloud Platform
I scaled a microservice architecture on Google Cloud Platform using GKE (Google Kubernetes Engine). For the purpose of deploying, administering, and growing containerized applications using Kubernetes, GKE provides a fully managed, scalable, and secure environment.
\
\
For this educational project, the cluster used spot instances on many nodes to keep expenses low. To ensure maximum availability, the gateway was available on each node. The timeline and Keycloak service were also both kept at a high level of availability. Not implying the rest had bad availability.
\
\
The microservices were managed using Kubernetes. The services were able to scale both horizontally and vertically successfully, according to the load test performed using Locust. While keeping costs down, a highly available, scalable solution was made possible through the usage of GKE. These technologies offered a solid management foundation for the microservices, ensuring top performance.

## Frontend
The frontend is made with Svelte and TailwindCSS. To consume the API I used Axios. The frontend is hosted on Google Cloud Storage and is served through a CDN. Rayco.digital is also hosted this way. It's a very cheap and especially fast way to serve static content.

## Conclusion
I'm familiar with building large enterprise systems. Though it's not something I like doing fully on my own. Google Cloud is a great place to host such an architecture. However it would've worked just as well (or perhaps better) on Azure or AWS.