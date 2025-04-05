"use strict";
(function () {
    // Função utilitária para selecionar qualquer elemento
    var $ = function (query) {
        return document.querySelector(query);
    };
    function patio() {
        // Lê os veículos do localStorage
        function ler() {
            return JSON.parse(localStorage.getItem("patio") || "[]");
        }
        // Salva o array de veículos no localStorage
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        // Adiciona um novo veículo e re-renderiza a tabela
        function adicionar(veiculo) {
            var veiculos = ler();
            veiculos.push(veiculo);
            salvar(veiculos);
            render();
        }
        // Remove o veículo com a placa informada e re-renderiza a tabela
        function remover(placa) {
            var veiculos = ler().filter(function (veiculo) { return veiculo.placa !== placa; });
            salvar(veiculos);
            render();
        }
        // Renderiza a tabela de veículos no <tbody id="patio">
        function render() {
            var tbody = $("#patio");
            tbody.innerHTML = ""; // Limpa o conteúdo anterior
            var veiculos = ler();
            veiculos.forEach(function (veiculo) {
                var row = document.createElement("tr");
                row.innerHTML = "\n          <td>".concat(veiculo.nome, "</td>\n          <td>").concat(veiculo.modelo, "</td>\n          <td>").concat(veiculo.placa, "</td>\n          <td>").concat(new Date(veiculo.entrada).toLocaleString(), "</td>\n          <td><button class=\"delete\" data-placa=\"").concat(veiculo.placa, "\">X</button></td>\n        ");
                tbody.appendChild(row);
            });
        }
        return { ler: ler, adicionar: adicionar, remover: remover, salvar: salvar, render: render };
    }
    // Instancia o módulo de estacionamento
    var estacionamento = patio();
    // Aguarda o carregamento completo do DOM
    document.addEventListener("DOMContentLoaded", function () {
        var _a, _b;
        // Renderiza os veículos ao carregar a página
        estacionamento.render();
        // Evento para cadastrar um veículo
        (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            var _a, _b, _c;
            var nome = (_a = document.querySelector("#nome")) === null || _a === void 0 ? void 0 : _a.value;
            var modelo = (_b = document.querySelector("#modelo")) === null || _b === void 0 ? void 0 : _b.value;
            var placa = (_c = document.querySelector("#placa")) === null || _c === void 0 ? void 0 : _c.value;
            if (!nome || !modelo || !placa) {
                alert("Os campos nome, placa e modelo são obrigatórios!");
                return;
            }
            estacionamento.adicionar({
                nome: nome,
                modelo: modelo,
                placa: placa,
                entrada: new Date(),
                saida: null,
            });
        });
        // Utiliza event delegation para capturar cliques nos botões de remoção
        (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function (e) {
            var target = e.target;
            if (target.classList.contains("delete")) {
                var placa = target.dataset.placa;
                if (placa) {
                    estacionamento.remover(placa);
                }
            }
        });
    });
})();
