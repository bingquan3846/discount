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
    })
    .factory('LoginService', function($http){
        return {
            request: function(username,password){
                  return  $http.post('http://magento.localhost:9090/rest/V1/integration/admin/token?username='+username+'&password='+password);
            },
            getProfile: function(){
                if(sessionStorage.userToken){
                    return sessionStorage.userToken;
                }else{
                    return 0;
                }
            },
            switchMenu: function(){
                if(sessionStorage.userToken){
                    angular.element(document.querySelector('#login')).css('display', 'none');
                    angular.element(document.querySelector('#myInfo')).css('display', 'block');
                    angular.element(document.querySelector('#logout')).css('display', 'block');
                }else {
                    angular.element(document.querySelector('#login')).css('display', 'block');
                    angular.element(document.querySelector('#myInfo')).css('display', 'none');
                    angular.element(document.querySelector('#logout')).css('display', 'none');
                }
            }
        }
    })
    .factory('RestMagento', function($http){
        var baseUrl = "http://magento.localhost:9090/rest";

        return {
            getCategories: function(){

                return $http.get(baseUrl + "/V1/categories", {
                    headers: {
                        "Authorization": 'Bearer ' + sessionStorage.userToken
                    }
                });
            }
        }
    });