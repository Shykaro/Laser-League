namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let transform: ƒ.Matrix4x4;
  let agent: ƒ.Node;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let graph: ƒ.Node = viewport.getBranch();
    console.log("graph" + graph);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update); 
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  //60 Bilder pro sekunde, frachtet auf framerate time rum anstatt realtime ,start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    viewport.camera.mtxPivot.translateZ(-25); //ändert entfernung der Camera beim start des Spiels, ist hinzugefügt

    let laser: ƒ.Node = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser2")[0];

    agent = graph.getChildrenByName("Agents")[0].getChildrenByName("Agent1")[0];

    transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;

  }

  function update(_event: Event): void {
    
    movement(_event);

    //let speedAgentTranslation: number= 10; //meters per second
    //let speedAgentRotation: number = 360; //meters per second
    let speedLaserRotate: number = 360; //degrees per second, bestimmt die game geschwindigkeit oder eher gesagt die rotationsgeschwindigkeit
    transform.rotateZ(speedLaserRotate * ƒ.Loop.timeFrameReal / 1000); //dazugehörige funktion

    // ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function movement(_event: Event): void {

    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000

    let speedAgentTranslation: number = 10; // meters per second
    //let speedAgentRotation: number = 360; // meters per second I DONT WANT TO ROTATE

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
      agent.mtxLocal.translateY(speedAgentTranslation * deltaTime)
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
      agent.mtxLocal.translateY(-speedAgentTranslation * deltaTime)
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      agent.mtxLocal.translateX(speedAgentTranslation * deltaTime) //falls rotationY, benutze speedAgentRotation
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      agent.mtxLocal.translateX(-speedAgentTranslation * deltaTime) //falls rotationY, benutze speedAgentRotation
    }
  }
}