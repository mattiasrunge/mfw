"use strict";

const socket = require("/socket.io/socket.io.js");

let connection = null;
let connected = false;

module.exports = {
    connect: () => {
        console.log("Connecting to backend...");

        connected = false;
        connection = socket.connect();

        connection.on("connect", () => {
            console.log("Connected to backend!");
            connected = true;
        });

        connection.on("reconnect", () => {
            console.log("Reconnected to backend!");
            connected = true;
        });

        connection.on("connect_error", (error) => {
            console.error("Error when connecting to backend, ", error);
            connected = false;
        });

        connection.on("reconnect_error", (error) => {
            console.error("Error when reconnecting to backend, ", error);
            connected = false;
        });

        connection.on("reconnect_failed", (error) => {
            console.error("Failed to reconnect to backend, ", error);
            connected = false;
        });

        connection.on("connect_timeout", (error) => {
            console.error("Connection to backend timed out, ", error);
            connected = false;
        });
    },
    on: (name, callback) => {
        connection.on(name, callback);

        if (name === "connect" && connected) {
            callback();
        }
    },
    off: (name, callback) => {
        connection.removeListener(name, callback);
    },
    emit: (name, data, callback) => {
        connection.emit(name, data, callback);
    }
};

module.exports.connect();
