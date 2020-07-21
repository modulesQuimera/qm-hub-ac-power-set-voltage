module.exports = function(RED) {

    "use strict";
    var mapeamentoNode;

    function SetVoltageNode(config) {
        RED.nodes.createNode(this, config);
        this.mapeamento = config.mapeamento;
        this.phase_selector = config.phase_selector;
        this.tesion_value = config.tesion_value;

        var node = this;
        mapeamentoNode = RED.nodes.getNode(this.mapeamento);
        
        node.on('input', function(msg, send, done) {
            var globalContext = node.context().global;
            // var exportMode = globalContext.get("exportMode");
            var currentMode = globalContext.get("currentMode");
            var command = {
                type: "AC_Power_Source_modular_V1_0",
                slot: parseInt(mapeamentoNode.slot),
                method: "set_voltage",
                phase_selector: node.phase_selector,
                tesion_value: parseFloat(node.tesion_value),
                get_output: {},
                compare: {}
            };
            var file = globalContext.get("exportFile");
            var slot = globalContext.get("slot");
            if(!(slot === "begin" || slot === "end")){
                if(currentMode == "test"){
                    file.slots[slot].jig_test.push(command);
                }
                else{
                    file.slots[slot].jig_error.push(command);
                }
            }
            else{
                if(slot === "begin"){
                    file.slots[0].jig_test.push(command);
                    // file.begin.push(command);
                }
                else{
                    file.slots[3].jig_test.push(command);
                    // file.end.push(command);
                }
            }
            globalContext.set("exportFile", file);
            console.log(command);
            send(msg);
        });
    }
    RED.nodes.registerType("set_voltage", SetVoltageNode);

    RED.httpAdmin.get("/getMapeamentoACPower",function(req,res) {
        if(mapeamentoNode){
            res.json([
                {value:mapeamentoNode.valuePort1, label: "VA - " + mapeamentoNode.labelPort1, hasValue:false},
                {value:mapeamentoNode.valuePort2, label: "VB - " + mapeamentoNode.labelPort2, hasValue:false},
                {value:mapeamentoNode.valuePort3, label: "VC - " + mapeamentoNode.labelPort3, hasValue:false},
                {value:mapeamentoNode.valuePort4, label: "IABC - " + mapeamentoNode.labelPort4, hasValue:false},
            ]);
        }
        else{
            res.json([
                {label: "VA - ", value:"A",  hasValue:false},
                {label: "VB - ", value:"B" , hasValue:false},
                {label: "VC - ",value:"C", hasValue:false},
                {label: "IABC - ", value:"*" , hasValue:false},
            ]);
        }
    });
};
