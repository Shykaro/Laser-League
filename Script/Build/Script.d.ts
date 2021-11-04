declare namespace Script {
    import ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        health: number;
        name: string;
        constructor();
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class LaserCustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        speedLaserRotate: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update: () => void;
    }
}
declare namespace Script {
}
