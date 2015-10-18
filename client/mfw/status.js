"use strict";

define([
    "knockout",
    "mprogress"
], function(ko, Mprogress) {
    var Me = function() {
        var mprogress = new Mprogress({ template: 4 });
        var list = ko.observableArray();

        this.create = function() {
            var status = {
                loading: ko.observable(false),
                error: ko.observable(false)
            };

            list.push(status);
            return status;
        };

        this.destroy = function(status) {
            list.remove(status);
        };

        ko.computed(function() {
            var loading = list().filter(function(status) {
                return status.loading();
            }).length > 0;

            var errors = list().filter(function(status) {
                return status.error();
            }).map(function(status) {
                return ko.unwrap(status.error);
            });

            if (loading) {
                mprogress.start();
            } else {
                mprogress.end();
            }

            if (errors.length > 0) {
                console.error(errors);
            }
        });
    };

    return new Me();
});
