module.exports = function(RED) {

    var mapeamentoNode;

    // function multipleSetPhase(self, file, slot, currentMode) {
    //     for (var t = 0; t < self.qtdSetVoltage; t++) {
    //         var command_n = {
    //             type: "AC_Power_Source_modular_V1_0",
    //             slot: parseInt(mapeamentoNode.slot),
    //             method: "set_voltage",
    //             phase_selector: self.phase_selector_n[t],
    //             tesion_value: parseFloat(self.tesion_value_n[t]),
    //             get_output: {},
    //             compare: {}
    //         }
    //         if (!(slot === "begin" || slot === "end")) {
    //             if (currentMode == "test") {
    //                 file.slots[slot].jig_test.push(command_n);
    //             } else {
    //                 file.slots[slot].jig_error.push(command_n);
    //             }
    //         } else {
    //             if (slot === "begin") {
    //                 file.slots[0].jig_test.push(command_n);
    //             } else {
    //                 file.slots[3].jig_test.push(command_n);
    //             }
    //         }
    //     }
    //     return file;
    // }

    function SetVoltageNode(config) {
        RED.nodes.createNode(this, config);
        this.mapeamento = config.mapeamento;
        this.phase_selector = config.phase_selector;
        this.tesion_value = config.tesion_value;

        this.phase_selectorA = config.phase_selector1;
        this.phase_selectorB = config.phase_selector2;
        this.phase_selectorC = config.phase_selector3;


        // this.qtdSetVoltage = config.qtdSetVoltage;
        // this.tesion_value_n = []; this.phase_selector_n = [];
        // this.phase_selector_n.push(config.phase_selector1); this.tesion_value_n.push(config.tesion_value1);
        // this.phase_selector_n.push(config.phase_selector2); this.tesion_value_n.push(config.tesion_value2);
        // this.phase_selector_n.push(config.phase_selector3); this.tesion_value_n.push(config.tesion_value3);
        // this.phase_selector_n.push(config.phase_selector4); this.tesion_value_n.push(config.tesion_value4);
        // this.phase_selector_n.push(config.phase_selector5); this.tesion_value_n.push(config.tesion_value5);
        // this.phase_selector_n.push(config.phase_selector6); this.tesion_value_n.push(config.tesion_value6);
        // this.phase_selector_n.push(config.phase_selector7); this.tesion_value_n.push(config.tesion_value7);
        // this.phase_selector_n.push(config.phase_selector8); this.tesion_value_n.push(config.tesion_value8);
        // this.phase_selector_n.push(config.phase_selector9); this.tesion_value_n.push(config.tesion_value9);
        // this.phase_selector_n.push(config.phase_selector10); this.tesion_value_n.push(config.tesion_value10);
        // this.phase_selector_n.push(config.phase_selector11); this.tesion_value_n.push(config.tesion_value11);
        // this.phase_selector_n.push(config.phase_selector12); this.tesion_value_n.push(config.tesion_value12);
        // this.phase_selector_n.push(config.phase_selector13); this.tesion_value_n.push(config.tesion_value13);
        // this.phase_selector_n.push(config.phase_selector14); this.tesion_value_n.push(config.tesion_value14);
        // this.phase_selector_n.push(config.phase_selector15); this.tesion_value_n.push(config.tesion_value15);
        // this.phase_selector_n.push(config.phase_selector16); this.tesion_value_n.push(config.tesion_value16);
        // this.phase_selector_n.push(config.phase_selector17); this.tesion_value_n.push(config.tesion_value17);
        // this.phase_selector_n.push(config.phase_selector18); this.tesion_value_n.push(config.tesion_value18);
        // this.phase_selector_n.push(config.phase_selector19); this.tesion_value_n.push(config.tesion_value19);
        // this.phase_selector_n.push(config.phase_selector20); this.tesion_value_n.push(config.tesion_value20);
        // this.phase_selector_n.push(config.phase_selector21); this.tesion_value_n.push(config.tesion_value21);
        // this.phase_selector_n.push(config.phase_selector22); this.tesion_value_n.push(config.tesion_value22);
        // this.phase_selector_n.push(config.phase_selector23); this.tesion_value_n.push(config.tesion_value23);
        // this.phase_selector_n.push(config.phase_selector24); this.tesion_value_n.push(config.tesion_value24);

        var node = this;
        mapeamentoNode = RED.nodes.getNode(this.mapeamento);

        node.on('input', function(msg, send, done) {
            var globalContext = node.context().global;
            var currentMode = globalContext.get("currentMode");
            var command = {
                type: "AC_Power_Source_modular_V1_0",
                slot: parseInt(mapeamentoNode.slot),
                method: "set_voltage",
                // phase_selector: node.phase_selector,
                tesion_value: parseFloat(node.tesion_value),
                VA: node.phase_selectorA,
                VB: node.phase_selectorB,
                VC: node.phase_selectorC,
                get_output: {},
                compare: {}
            };
            var file = globalContext.get("exportFile");
            var slot = globalContext.get("slot");
            if (!(slot === "begin" || slot === "end")) {
                if (currentMode == "test") {
                    file.slots[slot].jig_test.push(command);
                    // file = multipleSetPhase(node, file, slot, currentMode);
                } else {
                    file.slots[slot].jig_error.push(command);
                    // file = multipleSetPhase(node, file, slot, currentMode);
                }
            } else {
                if (slot === "begin") {
                    file.slots[0].jig_test.push(command);
                    // file = multipleSetPhase(node, file, slot, currentMode);
                } else {
                    file.slots[3].jig_test.push(command);
                    // file = multipleSetPhase(node, file, slot, currentMode);
                }
            }
            globalContext.set("exportFile", file);
            console.log("robsonnnnnnnnnnnnnnnnnn")
            console.log(command);
            send(msg);
        });
    }
    RED.nodes.registerType("set_voltage", SetVoltageNode);

    RED.httpAdmin.get("/getMapeamentoACPower", function(req, res) {
        if (mapeamentoNode) {
            res.json([
                { value: mapeamentoNode.valuePort1, label: "VA - " + mapeamentoNode.labelPort1, hasValue: false },
                { value: mapeamentoNode.valuePort2, label: "VB - " + mapeamentoNode.labelPort2, hasValue: false },
                { value: mapeamentoNode.valuePort3, label: "VC - " + mapeamentoNode.labelPort3, hasValue: false },
                { value: mapeamentoNode.valuePort4, label: "IABC - " + mapeamentoNode.labelPort4, hasValue: false },
            ]);
        } else {
            res.json([
                { label: "VA - ", value: "A", hasValue: false },
                { label: "VB - ", value: "B", hasValue: false },
                { label: "VC - ", value: "C", hasValue: false },
                { label: "IABC - ", value: "*", hasValue: false },
            ]);
        }
    });
};