"use strict";

const ko = require("knockout");
const socket = require("mfw/socket");

module.exports = () => {
        this.response = ko.observable(false);

        console.log("Sending Ping");
        socket.emit("echo", "pong", (error, data) => {
            if (error) {
                console.error(error);
                this.response(error);
                return;
            }

            console.log("Received " + data);
            this.response(data);
        });
    };
};
