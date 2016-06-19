#pragma strict

public class Wander extends Steering{
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3;
	
	protected var randomPoint : Vector3;
	protected var valueAngleY : float;
	protected var valueAngleZ : float;
	protected var abruptChangeCount : int = 0;
	
	protected var distance : float = 0;
	
	public var constraint_y : boolean = false;
	public var logicSphereRadii : float = 3.0;
	public var logicSphereDistance : float = 5.0;
	
	protected var logicSphereDistance2 : float;
	
	public function getSteeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering){
			if(distance <= 1){
				if(constraint_y) valueAngleY = 0;
				else valueAngleY = Random.Range(0, 360);
				valueAngleZ = Random.Range(0, 360);
				
				if(abruptChangeCount == 0){
					logicSphereDistance2 = logicSphereDistance;
					logicSphereDistance = 0.0;
				}
				randomPoint = spherePoint(valueAngleY, valueAngleZ);
				if(abruptChangeCount == 0){
					logicSphereDistance = logicSphereDistance2;
					abruptChangeCount = Random.Range(3, 10);
				}
				else abruptChangeCount -= 1;
			}
			
			distance = Vector3.Distance(transform.localPosition, randomPoint);
			velDeseada = Vector3.Normalize(randomPoint - transform.localPosition)*velMax;
			direcDeGuiado = velDeseada - velocidad;
		}
		
		return direcDeGuiado;
	}
	
	private function spherePoint(angleY : float, angleZ : float) : Vector3{
		var radianZ = angleZ * Mathf.PI / 180;
		var radianY = angleY * Mathf.PI / 180;
		
		var x = logicSphereRadii * Mathf.Cos(radianY) * Mathf.Sin(radianZ) + transform.localPosition.x;
		var y = logicSphereRadii * Mathf.Sin(radianY) * Mathf.Sin(radianZ) + transform.localPosition.y;
		var z = logicSphereRadii * Mathf.Cos(radianZ) + transform.localPosition.z;
		
		return transform.forward*logicSphereDistance + Vector3(x, y, z);
	}
}