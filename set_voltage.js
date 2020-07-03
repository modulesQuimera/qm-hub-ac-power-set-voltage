module.exports = function(RED) {

    "use strict";
    var mapeamentoNode;

    function SetVoltageNode(config) {
        RED.nodes.createNode(this, config);
        this.mapeamento = config.mapeamento
        this.channel = config.channel

        var node = this
        mapeamentoNode = RED.nodes.getNode(this.mapeamento);
        
        node.on('input', function(msg, send, done) {
            var globalContext = node.context().global;
            // var exportMode = globalContext.get("exportMode");
            var currentMode = globalContext.get("currentMode");
            var command = {
                type: "AC_Power_Source_modular_V1.0",
                slot: 1,
                method: "set_voltage",
                channel: node.channel
            }
            var file = globalContext.get("exportFile")
            var slot = globalContext.get("slot");
            if(currentMode == "test"){file.slots[slot].jig_test.push(command)}
            else{file.slots[slot].jig_error.push(command)}
            globalContext.set("exportFile", file);
            node.status({fill:"green", shape:"dot", text:"done"}); // seta o status pra waiting
            // msg.payload = command
            send(msg)
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
            ])
        }
        else{
            res.json([
                {label: "VA - ", value:"A",  hasValue:false},
                {label: "VB - ", value:"B" , hasValue:false},
                {label: "VC - ",value:"C", hasValue:false},
                {label: "IABC - ", value:"*" , hasValue:false},
            ])
        }
    });
}
