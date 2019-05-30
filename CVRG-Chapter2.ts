class Playground {
	public static CreateScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
		var scene = new BABYLON.Scene(engine);

		var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
		camera.setTarget(BABYLON.Vector3.Zero());
		camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

    
       // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        var ground = BABYLON.Mesh.CreateGround("ground", 10, 10, 2, scene);        
       // Add a sphere
        var sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);

        // Move the sphere upward 
        sphere.position.y = 5;

        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        ground.material = groundMaterial;

        var ballMaterial = new BABYLON.StandardMaterial("ballMaterial", scene);
        ballMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        sphere.material = ballMaterial;

        scene.enablePhysics();

        var sphereImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor,{mass: 1}, scene);
        var groundImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0}, scene);

       sphere.physicsImpostor = sphereImpostor;
       ground.physicsImpostor = groundImpostor;

       var bounce = new BABYLON.Sound("Bounce", "sounds/bounce.wav", scene, null);

    function pushMesh(mesh) {
          mesh.applyImpulse(new BABYLON.Vector3(0, 10, 0), mesh.getAbsolutePosition());
    }    

    function pushMeshTriggerFunc(evt) {
        if(evt.meshUnderPointer === sphere){
            pushMesh(sphere);
        }
    }

    window.addEventListener("keydown", function (evt) {
        // spacebar key interaction
        if (evt.keyCode == 32) { 
           pushMesh(sphere);
         };
    } );

    sphere.actionManager = new BABYLON.ActionManager(scene);
    sphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger, pushMeshTriggerFunc ));
    
    var vrHelper = scene.createDefaultVRExperience()
    sphereImpostor.registerOnPhysicsCollide(groundImpostor, 
    function(mesh, collided) {
        mesh.object.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        bounce.play();
   });


		return scene;
	}
}
