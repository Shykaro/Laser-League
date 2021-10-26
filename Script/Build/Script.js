"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let CustomComponentScript = /** @class */ (() => {
        class CustomComponentScript extends ƒ.ComponentScript {
            constructor() {
                super();
                // Properties may be mutated by users in the editor via the automatically created user interface
                this.message = "CustomComponentScript added to ";
                // Activate the functions of this component as response to events
                this.hndEvent = (_event) => {
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
                // Don't start when running in editor
                if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                    return;
                // Listen to this component being added to or removed from a node
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            }
        }
        // Register the script as component for use in the editor via drag&drop
        CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        return CustomComponentScript;
    })();
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let transform;
    let agent;
    let agentPos;
    async function start(_event) {
        viewport = _event.detail;
        //let deltaTime; //zuende copy-en
        let graph = viewport.getBranch();
        console.log("graph" + graph);
        let laser = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser2")[0];
        let graphLaser = await ƒ.Project.registerAsGraph(laser, false);
        let copy = new ƒ.GraphInstance(graphLaser);
        agent = graph.getChildrenByName("Agents")[0].getChildrenByName("Agent1")[0];
        transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;
        graph.getChildrenByName("Lasers")[0].addChild(copy);
        copy.addComponent(new ƒ.ComponentTransform);
        copy.mtxLocal.translateX(5);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); //60 Bilder pro sekunde, frachtet auf framerate time rum anstatt realtime ,start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        viewport.camera.mtxPivot.translateZ(-25); //ändert entfernung der Camera beim start des Spiels, ist hinzugefügt
    }
    function update(_event) {
        movement(_event);
        //collision(_event);
        //let speedAgentTranslation: number= 10; //meters per second
        //let speedAgentRotation: number = 360; //meters per second
        let speedLaserRotate = 360; //degrees per second, bestimmt die game geschwindigkeit oder eher gesagt die rotationsgeschwindigkeit
        transform.rotateZ(speedLaserRotate * ƒ.Loop.timeFrameReal / 1000); //dazugehörige funktion gleich wieder ent-kommentieren
        // ƒ.Physics.world.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    /*function collision(_event: Event): void {
      
      let beam: ƒ.Node = ... Und das darunter kopieren.
      
      console.log(agentPos.translation); //Hopefully player position brauche player position, gleiche mit bounding box von laser ab, siehe onenote notizen.
  
    }*/
    function movement(_event) {
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        let speedAgentTranslation = 10; // meters per second
        //let speedAgentRotation: number = 360; // meters per second I DONT WANT TO ROTATE
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
            agent.mtxLocal.translateY(speedAgentTranslation * deltaTime);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
            agent.mtxLocal.translateY(-speedAgentTranslation * deltaTime);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            agent.mtxLocal.translateX(speedAgentTranslation * deltaTime); //falls rotationY, benutze speedAgentRotation
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            agent.mtxLocal.translateX(-speedAgentTranslation * deltaTime); //falls rotationY, benutze speedAgentRotation
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map