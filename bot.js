//Get settings token
const { token } = require("./settings.json");
const {
    conan_rcon_host,
    conan_rcon_options,
    conan_rcon_password,
    conan_rcon_port,
} = require("./settings.json");
//Get Discord.JS object
const Discord = require("discord.js");
const rcon = require("./lib/rcon");
const discordClient = new Discord.Client();

//Allowed channels to monitor
const allowedChannels = ["test"];

//Init Rcon
const conanRcon = new rcon(
    conan_rcon_host,
    conan_rcon_port,
    conan_rcon_password,
    conan_rcon_options
);

//#region Discord
//Bot ready
discordClient.on("ready", () => {
    //Print BOT name
    console.log(`Logged in as ${discordClient.user.tag}!`);
});

// Create an event listener for messages
discordClient.on("message", (message) => {
    // If the message is "ping"
    if (message.content === "ping") {
        // Log "ping", name and channel
        console.log(
            `Ping received from ${message.author.username} in channel #${message.channel.name}!`
        );
    }

    if (allowedChannels.includes(message.channel.name)) {
        //Print bot information
        if (message.content === "!botinfo") {
            message.channel.send(
                `:robot: Hi! I am A.S.A.I., an **A**dvanced **S**ystem **A**rtificial **I**ntelligence. Nice to meet you!`
            );
        }

        //Delete all in TEST channel
        if (message.content === "!flushchannel" && message.channel.name === 'test') {
            console.log('Starting flush...');
            message.channel.bulkDelete(100).then(console.log(`Deleted`));
        }

        if (message.content === "!playerlist" && message.channel.name === 'test') {//conanserver
            conanRcon.send("listplayers");
            console.log('request sent to rcon');
        }

        if (message.content === "!rcon_help" && message.channel.name === 'test') {//conanserver
            conanRcon.send("help");
            console.log('request sent to rcon');
        }

        if (message.content === "!rcon_connect" && message.channel.name === 'test') {//conanserver
            conanRcon.connect();
            console.log('request sent to rcon');
        }

        if (message.content.includes("!broadcast") && message.channel.name === 'test') {//conanserver
            conanRcon.send(message.content.substr(1));
            console.log('request sent to rcon');
        }
    }
});

discordClient.login(token);
//#endregion

//#region RCON Conan Exiles

//Connected
conanRcon.on("auth", () => {
    console.log("Logged into RCON");
    console.log(`
    Is authed: ${conanRcon.hasAuthed},
    Challenge: ${conanRcon.challenge}`);
});

//Connection was closed
conanRcon.on("end", () => {
    console.log("Connection closed to RCON");
});

//Server sent a response to a command
conanRcon.on('response', function(str) {
    console.log("Got response: " + str);
});

//Server sent a message regardless of command
conanRcon.on('server', function(server) {
    console.log(server);
});

//Server sent an error message
conanRcon.on("error", function(error) {
    console.log(error);
});

conanRcon.connect();

//#endregion