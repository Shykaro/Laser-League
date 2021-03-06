"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        health = 1;
        name = "Agent 47";
        constructor() {
            super("Agent");
            this.addComponent(new ƒ.ComponentTransform);
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshQuad("MeshAgent")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("mtrAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1)))));
            this.mtxLocal.scale(ƒ.Vector3.ONE(0.5));
            //this.mtxLocal.translateZ(0.5); Unneccesary
            //this.activate(true);
        }
    }
    Script.Agent = Agent;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class LaserCustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(LaserCustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "LasertCustomComponentScrip added to ";
        speedLaserRotate = 360; //degrees per second, bestimmt die game geschwindigkeit oder eher gesagt die rotationsgeschwindigkeit
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        /*public checkCollision(_pos: ƒ.Vector3, radius: number): boolean{
          let beams: ƒ.Node[] = this.node.getChildrenByName("Beam");
          let mtxMeshPivot: ƒ.Matrix4x4 = beams[0].getComponents(ƒ.ComponentMesh).mtxPivot;
          for (let beam of beams){
            let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_pos, beam.mtxWorldInverse, true);
            if (posLocal.y < -_radius || posLocal.y > mtxMeshPivot.scaling.y + _radius || posLocal.x < -mtxMeshPivot.scaling.x / 2 - _radius);
            continue;
            return true;
          }
          return false;
        } */
        update = () => {
            //let deltaTime: number = ƒ.Loop.timeFrameReal / 1000; // USE THIS FOR TIME
            //this.node.mtxLocal.rotateZ(this.speedLaserRotate * deltaTime); //dazugehörige funktion gleich wieder ent-kommentieren
        };
    }
    Script.LaserCustomComponentScript = LaserCustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let laser;
    let agent;
    let agentPos;
    let beamWidth = 0.7;
    let agentRadius = 0.5;
    let beamHeight = 6;
    let copyLaser;
    let countLaserblocks = 4; //anzahl der verschiedenen Laser
    async function start(_event) {
        viewport = _event.detail;
        //let deltaTime; //zuende copy-en
        let graph = viewport.getBranch();
        console.log("graph" + graph);
        addLaser(_event, graph);
        laser = graph.getChildrenByName("Lasers")[0];
        //laser.mtxLocal.translateX(5); //remove, wurde am 02.11 hinzugefügt?
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); //60 Bilder pro sekunde, frachtet auf framerate time rum anstatt realtime ,start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        viewport.camera.mtxPivot.translateZ(-25); //ändert entfernung der Camera beim start des Spiels, ist hinzugefügt
        //graph.getChildrenByName("Lasers")[0].addChild(copyLaser);
        //copyLaser.mtxLocal.translation = ƒ.Vector3.X(10);
        //agent = graph.getChildrenByName("Agents")[0].getChildrenByName("Agent1")[0];
        agent = new Script.Agent; //ersetzt das normale let agent: ƒ.Node;
        graph.getChildrenByName("Agents")[0].addChild(agent);
        let domName = document.querySelector("#Hud>h1");
        domName.textContent = agent.name;
    }
    function update(_event) {
        movement(_event);
        Collision(); //MAKE IT WORK, UNTEN.
        //let speedAgentTranslation: number= 10; //meters per second
        //let speedAgentRotation: number = 360; //meters per second
        //let speedLaserRotate: number = 360; //degrees per second, bestimmt die game geschwindigkeit oder eher gesagt die rotationsgeschwindigkeit
        //this.transform.rotateZ(speedLaserRotate * ƒ.Loop.timeFrameReal / 1000); //dazugehörige funktion gleich wieder ent-kommentieren
        // ƒ.Physics.world.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
        //Healthbar for Agent -------------
        //agent.health
        let domHealth = document.querySelector("input");
        domHealth.value = agent.health.toString();
    }
    /*function collision(_event: Event): void {
      
      let beam: ƒ.Node = ... Und das darunter kopieren.
      
      console.log(agentPos.translation); //Hopefully player position brauche player position, gleiche mit bounding box von laser ab, siehe onenote notizen.
  
    }*/
    async function addLaser(_event, _graph) {
        let graphLaser = FudgeCore.Project.resources["Graph|2021-11-01T17:49:49.114Z|30477"]; // get the laser-ressource
        let startPos = new ƒ.Vector2(-8, -4);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < countLaserblocks / 2; j++) {
                copyLaser = await ƒ.Project.createGraphInstance(graphLaser);
                copyLaser.mtxLocal.translation = new ƒ.Vector3(startPos.x + j * 15, startPos.y + i * 8, 0);
                _graph.getChildrenByName("Lasers")[0].addChild(copyLaser);
                copyLaser.getComponent(Script.LaserCustomComponentScript).speedLaserRotate = ƒ.random.getRange(90, 150);
                if (i > 0) {
                    copyLaser.getComponent(Script.LaserCustomComponentScript).speedLaserRotate *= -1;
                }
            }
        }
    }
    function movement(_event) {
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        let speedAgentTranslation = 10; // meters per second
        let speedAgentRotation = 360; // meters per second //I DONT WANT TO ROTATE
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
            agent.mtxLocal.translateY(speedAgentTranslation * deltaTime);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
            agent.mtxLocal.translateY(-speedAgentTranslation * deltaTime);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            agent.mtxLocal.rotateZ(-speedAgentRotation * deltaTime); //falls rotateY, benutze speedAgentRotation
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            agent.mtxLocal.rotateZ(speedAgentRotation * deltaTime); //falls rotateY, benutze speedAgentRotation, falls Translate, benutze agent translation
        }
    }
    function Collision() {
        for (let i = 0; i < laser.getChildren().length; i++) {
            laser.getChildren()[i].getChildrenByName("Arms")[0].getChildren().forEach(element => {
                let beam = element;
                let posLocal = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
                /* let minX = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + agent.radius;
                let minY = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + agent.radius;
                //console.log(posLocal.toString()+ beam.name);
        
        
                if (posLocal.x <= (minX) && posLocal.x >= -(minX) && posLocal.y <= minY && posLocal.y >= 0) {
                  agent.getComponent(agentComponentScript).respwan;
                }
         */
                if (posLocal.x < (-agentRadius) || posLocal.x > (beamWidth + agentRadius) || posLocal.y < (beamHeight / 2 - agentRadius) || posLocal.y > (beamHeight / 2 + agentRadius)) {
                    //console.log("not intersecting");
                }
                else {
                    console.log("intersecting");
                }
            });
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map