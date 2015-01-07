
#pragma strict

// Declares this as the Unity Inspector for the OGPage class
// (firstpass/Plugins/OpenGUI/Scripts/OGPage.js?)
// Viewable on Hierarchy Panel, UI/Home
@CustomEditor ( OGPage, true )
public class OGPageInspector extends Editor {
	override function OnInspectorGUI () {
		serializedObject.Update ();
		
		var page : OGPage = target as OGPage;
		var root : OGRoot =  OGRoot.GetInstance();

		if ( !page || !root ) { return; }
		
		DrawDefaultInspector ();
	
		EditorGUILayout.Space ();

		GUI.backgroundColor = Color.red;

		//Button to reset page style
		if ( GUILayout.Button ( "Reset styles" ) ) {
			page.ResetStyles (); 
		}
		
		GUI.backgroundColor = Color.green;
		
		//If this page is the current page
		if ( root.currentPage == page ) {
			//Create a button to update styles
			if ( GUILayout.Button ( "Update", GUILayout.Height(30) ) ) {
				OGRoot.GetInstance().SetDirty();
				page.UpdateStyles (); 
			}
		//Otherwise
		} else {
			//Create a button to set this as the current page
			if ( GUILayout.Button ( "Set current page", GUILayout.Height(30) ) ) {
				OGRoot.GetInstance().SetCurrentPage ( page );
				page.gameObject.SetActive ( true );	
				OGRoot.GetInstance().SetDirty();
			}
		}	
		GUI.backgroundColor = Color.white;

	}	
}
