"use strict";
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
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let transform;
    let laser;
    let agent;
    let agentPos;
    let beamWidth = 0.7;
    let agentRadius = 0.5;
    let beamHeight = 6;
    let copyLaser;
    async function start(_event) {
        viewport = _event.detail;
        //let deltaTime; //zuende copy-en
        let graph = viewport.getBranch();
        console.log("graph" + graph);
        laser = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser2")[0];
        let laserArray;
        let graphLaser = await ƒ.Project.registerAsGraph(laser, false);
        copyLaser = await ƒ.Project.createGraphInstance(graphLaser);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); //60 Bilder pro sekunde, frachtet auf framerate time rum anstatt realtime ,start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        viewport.camera.mtxPivot.translateZ(-25); //ändert entfernung der Camera beim start des Spiels, ist hinzugefügt
        let countLaser = graph.getChildrenByName("Lasers")[0].getChildren().length;
        console.log(countLaser);
        laserArray = new Array(countLaser);
        for (let i = 0; i < countLaser; i++) {
            laserArray[i] = graph.getChildrenByName("Lasers")[0].getChildren()[i].getChildrenByName("Center")[0].mtxLocal;
        }
        graph.getChildrenByName("Lasers")[0].addChild(copyLaser);
        copyLaser.mtxLocal.translation = ƒ.Vector3.X(10);
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
    //public hndEvent = (_event: Event){ ->
    //switch(_event.type){
    //  case ƒ.EVENT.COMPONENT()
    //}
    //PLS FILL }
    function update(_event) {
        movement(_event);
        Collision(); //MAKE IT WORK, UNTEN.
        //let speedAgentTranslation: number= 10; //meters per second
        //let speedAgentRotation: number = 360; //meters per second
        let speedLaserRotate = 360; //degrees per second, bestimmt die game geschwindigkeit oder eher gesagt die rotationsgeschwindigkeit
        this.transform.rotateZ(speedLaserRotate * ƒ.Loop.timeFrameReal / 1000); //dazugehörige funktion gleich wieder ent-kommentieren
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
        laser.getChildren()[0].getChildren().forEach(element => {
            let beam = element;
            let posLocal = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
            //console.log(posLocal.toString()+ beam.name);
            if (posLocal.x < (-beamWidth / 2 - agentRadius) || posLocal.x > (beamWidth / 2 + agentRadius) || posLocal.y < (agentRadius) || posLocal.y > (beamHeight + agentRadius)) {
                //console.log("not intersecting");
            }
            else {
                console.log("intersecting");
            }
        });
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map