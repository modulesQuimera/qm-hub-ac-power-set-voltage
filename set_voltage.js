module.exports = function(RED) {

    var mapeamentoNode;

    function SetVoltageNode(config) {
        RED.nodes.createNode(this, config);
        this.mapeamento = config.mapeamento;
        this.type_mode = config.type_mode;
        this.v_select = config.v_select;
        this.VA = config.VA;
        this.VB = config.VB;
        this.VC = config.VC;
        this.VN = config.VN;
        this.VA_value = config.VA_value;
        this.VB_value = config.VB_value;
        this.VC_value = config.VC_value;
        this.VA_value_solo = config.VA_value_solo;
        this.VB_value_solo = config.VB_value_solo;
        this.VC_value_solo = config.VC_value_solo;

        var node = this;
        mapeamentoNode = RED.nodes.getNode(this.mapeamento);

        node.on('input', function(msg, send, done) {
            var globalContext = node.context().global;
            var currentMode = globalContext.get("currentMode");
            var command = {};
            if(node.type_mode === 'mono'){

                var voltage_value;
                if(node.v_select === 'VA'){ voltage_value = node.VA_value_solo === "" ? 0 : parseFloat(node.VA_value_solo); }
                if(node.v_select === 'VB'){ voltage_value = node.VB_value_solo === "" ? 0 : parseFloat(node.VB_value_solo); }
                if(node.v_select === 'VC'){ voltage_value = node.VC_value_solo === "" ? 0 : parseFloat(node.VC_value_solo); }

                var mono_command = {
                    type: "AC_power_source_virtual_V1_0", 
                    slot: parseInt(mapeamentoNode.slot),
                    method: "set_voltage_mono",
                    compare:{},
                    phase_select:0,
                    voltage_value: voltage_value,
                    VA: node.VA,
                    VB: node.VB,
                    VC: node.VC,
                    VN: node.VN
                };
                command = mono_command;
               
            }else {

                var tri_command = {
                    type: "AC_power_source_virtual_V1_0",
                    slot: parseInt(mapeamentoNode.slot),
                    method: "set_voltage_tri",
                    compare:{},
                    voltage_A: node.VA_value === "" ? 0 : parseFloat( node.VA_value),
                    voltage_B: node.VB_value === "" ? 0 : parseFloat( node.VB_value),
                    voltage_C: node.VC_value === "" ? 0 : parseFloat( node.VC_value),
                    VA: node.VA,
                    VB: node.VB,
                    VC: node.VC,
                    VN: node.VN
                };
                command = tri_command;

            }
            var file = globalContext.get("exportFile");
            var slot = globalContext.get("slot");
            if (!(slot === "begin" || slot === "end")) {
                if (currentMode == "test") {
                    file.slots[slot].jig_test.push(command);  
                } else {
                    file.slots[slot].jig_error.push(command);
                }
            } else {
                if (slot === "begin") {
                    file.slots[0].jig_test.push(command);
                } else {
                    file.slots[3].jig_test.push(command);
                }
            }
            globalContext.set("exportFile", file);
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