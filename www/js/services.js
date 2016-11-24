angular.module('starter.services', [])

    .factory('Products', function() {

        var products = [{
            id: 0,
            title: 'Netzwerkarchitekt (m/w)',
            description: 'Das Handy klingelt, eine unbekannt Nummer wird angezeigt! Ein neuer Kunde? Wie reagiert man bei einem ersten Kundengespräch? '
        }, {
            id: 1,
            title: 'Agile Coach (m/w) Scrum, Kanban',
            description: 'Für unseren Kunden aus dem Versicherungsumfeld in Düsseldorf, Köln suchen wir ab sofort erfahrene Unterstützung als Coach (m/w) und Berater bei der Einführung und Umsetzung agiler Methoden. '
        },
        {
            id: 2,
            title: 'TEX_11602 - Multiprojekt-Support (f/m)',
            description: 'Köln suchen wir ab sofort erfahrene Unterstützung als Coach (m/w) und Berater bei der Einführung und Umsetzung agiler Methoden. '
        },
        {
            id: 3,
            title: 'System Entwickler c# .NET (m/w)',
            description: 'in Düsseldorf, Köln suchen wir ab sofort erfahrene Unterstützung als Coach (m/w) und Berater bei der Einführung und Umsetzung agiler Methoden. '
        }

        ];

        return {
            all: function() {
                return products;
            },

            get: function(productId) {
                for (var i = 0; i < products.length; i++) {
                    if (products[i].id === parseInt(productId)) {
                        return products[i];
                    }
                }
                return null;
            }
        };
    });