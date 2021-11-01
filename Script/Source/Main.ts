namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <any>start);

  let transform: ƒ.Matrix4x4;
  let laser: ƒ.Node;
  let agent: ƒ.Node;
  let agentPos: ƒ.Matrix3x3;
  let beamWidth: number = 0.7;
  let agentRadius: number = 0.5;
  let beamHeight: number = 6;
  let copyLaser: ƒ.GraphInstance;
  let countLaserblocks: number = 4; //anzahl der verschiedenen Laser

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    //let deltaTime; //zuende copy-en
    let graph: ƒ.Node = viewport.getBranch();
    console.log("graph" + graph);
    
    addLaser(_event, graph);
    
    laser = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser")[0];

    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update); 
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  //60 Bilder pro sekunde, frachtet auf framerate time rum anstatt realtime ,start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    viewport.camera.mtxPivot.translateZ(-25); //ändert entfernung der Camera beim start des Spiels, ist hinzugefügt


    graph.getChildrenByName("Lasers")[0].addChild(copyLaser);
    copyLaser.mtxLocal.translation = ƒ.Vector3.X(10);


    agent = graph.getChildrenByName("Agents")[0].getChildrenByName("Agent1")[0];

    transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;

  }

  function update(_event: Event): void {
    
    movement(_event);
    //Collision(); //MAKE IT WORK, UNTEN.

    //let speedAgentTranslation: number= 10; //meters per second
    //let speedAgentRotation: number = 360; //meters per second
    //let speedLaserRotate: number = 360; //degrees per second, bestimmt die game geschwindigkeit oder eher gesagt die rotationsgeschwindigkeit
    //this.transform.rotateZ(speedLaserRotate * ƒ.Loop.timeFrameReal / 1000); //dazugehörige funktion gleich wieder ent-kommentieren

    

    // ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  /*function collision(_event: Event): void {
    
    let beam: ƒ.Node = ... Und das darunter kopieren.
    
    console.log(agentPos.translation); //Hopefully player position brauche player position, gleiche mit bounding box von laser ab, siehe onenote notizen.

  }*/

  async function addLaser(_event: Event, _graph: ƒ.Node) {
    let graphLaser: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2021-11-01T17:49:49.114Z|30477"]; // get the laser-ressource

    let startPos: ƒ.Vector2 = new ƒ.Vector2(-15, -8);

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < countLaserblocks / 2; j++) {
        copyLaser = await ƒ.Project.createGraphInstance(graphLaser);

        copyLaser.mtxLocal.translation = new ƒ.Vector3(startPos.x + j * 15, startPos.y + i * 16, 0);

        _graph.getChildrenByName("Lasers")[0].addChild(copyLaser);

        copyLaser.getComponent(LaserCustomComponentScript).speedLaserRotate = ƒ.random.getRange(90, 150);

        if (i > 0) {
          copyLaser.getComponent(LaserCustomComponentScript).speedLaserRotate *= -1;
        }

      }
    }
  }

  function movement(_event: Event): void {

    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000

    let speedAgentTranslation: number = 10; // meters per second
    let speedAgentRotation: number = 360; // meters per second //I DONT WANT TO ROTATE

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
      agent.mtxLocal.translateY(speedAgentTranslation * deltaTime)
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
      agent.mtxLocal.translateY(-speedAgentTranslation * deltaTime)
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      agent.mtxLocal.rotateZ(-speedAgentRotation * deltaTime) //falls rotateY, benutze speedAgentRotation
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      agent.mtxLocal.rotateZ(speedAgentRotation * deltaTime) //falls rotateY, benutze speedAgentRotation, falls Translate, benutze agent translation
    }
  }

  function Collision(): void {

    laser.getChildren()[0].getChildren().forEach(element => {
      let beam: ƒ.Node = element;
      let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
      //console.log(posLocal.toString()+ beam.name);

      if (posLocal.x < (- beamWidth / 2 - agentRadius) || posLocal.x > (beamWidth / 2 + agentRadius) || posLocal.y < (agentRadius) || posLocal.y > (beamHeight + agentRadius)) {
        //console.log("not intersecting");
      } else {
        console.log("intersecting");
      }

    });
  } 

}