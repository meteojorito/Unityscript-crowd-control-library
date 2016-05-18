#pragma strict

public class Wander extends Steering{
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3 = Vector3.zero;
	
	protected var randomPoint : Vector3;
	protected var valueAngleY : float;
	protected var valueAngleZ : float;
	
	protected var topeCont : int = 0;
	protected var cont : int = topeCont;
	protected var distance : float = 0;
	
	public var constraint_y : boolean = false;
	public var logic_sphere_distance : float = 5;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering){
			if(distance > 0 && distance < 0.1){
				if(constraint_y) valueAngleY = 0;
				else valueAngleY = Random.Range(0, 360);
				valueAngleZ = Random.Range(0, 360);
				
				randomPoint = spherePoint(valueAngleY, valueAngleZ);
				cont = 0;
				topeCont = Random.Range(100, 200);
			}
			
			distance = Vector3.Distance(transform.localPosition, randomPoint);
			velDeseada = Vector3.Normalize(randomPoint - transform.localPosition)*velMax;
			direcDeGuiado = velDeseada - velocidad;
			
			//Debug.DrawRay(transform.localPosition, velocidad, Color.green, 500);
			//Debug.DrawRay(transform.localPosition, velDeseada, Color.red, 500);
			//Debug.DrawRay(transform.localPosition, direcDeGuiado, Color.blue, 500);
			
			cont++;
		}
		
		return direcDeGuiado;
	}
	
	private function spherePoint(angleY : float, angleZ : float) : Vector3{
		var radii = 3;
		var radianZ = angleZ * Mathf.PI / 180;
		var radianY = angleY * Mathf.PI / 180;
		
		var x = radii * Mathf.Cos(radianY) * Mathf.Sin(radianZ) + transform.localPosition.x;
		var y = radii * Mathf.Sin(radianY) * Mathf.Sin(radianZ) + transform.localPosition.y;
		var z = radii * Mathf.Cos(radianZ) + transform.localPosition.z;
		
		return new Vector3(x, y, z + logic_sphere_distance);
	}
}