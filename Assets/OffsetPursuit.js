#pragma strict

public class OffsetPursuit extends Steering{
	public var objetivo : GameObject;
	public var offset : float;
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		var dist = Vector3.Distance(objetivo.transform.localPosition, transform.localPosition);
		var velObj = objetivo.GetComponent(Vehicle).getVelocity();
		var estimPos = objetivo.transform.localPosition + velObj*dist;
		var vecEstimDist = estimPos - transform.localPosition;
		var proj = Vector3.ProjectOnPlane(vecEstimDist, transform.forward);
		//Debug.DrawRay(transform.localPosition, proj, Color.green, 500);
		var vecOffset = Vector3.Normalize(proj) * (-offset);

		//estimPos = transform.TransformPoint(estimPos + vecOffset);
		estimPos += vecOffset;
		//var aux : Vector3 = estimPos - objetivo.transform.localPosition;
		//Debug.DrawRay(objetivo.transform.localPosition, aux, Color.green, 500);
		velDeseada = Vector3.Normalize(estimPos - transform.localPosition)*velMax;
		direcDeGuiado = velDeseada - velocidad;
		
		return direcDeGuiado;
	}
}