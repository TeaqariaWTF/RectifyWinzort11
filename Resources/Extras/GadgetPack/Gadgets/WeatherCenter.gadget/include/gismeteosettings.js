//	Javascript file for the WeatherCenter gadget
//	(c) 2009
//	WeatherCenter Gadget Team
//	Development: hadj 
//	Graphics: Tex
//	Testing: Digital	
////////////////////////////////////////////////////////////////////////




function GismeteoLoadSettings()
{
	
	loccode.value = System.Gadget.Settings.read("GISlastSearch");
	if ((loccode.value).search(/\d/) > -1) loccode.value = "Москва, Россия";
	if ((loccode.value).search(/\d/) > -1 && navigator.systemLanguage == 'de-DE') loccode.value = "Berlin, Deutschland";
	loccode_id.value = System.Gadget.Settings.read("GISlocationCode");

	updateInt[0].disabled = true;
	updateInt[1].checked = "1";
	updateIntValue.value = System.Gadget.Settings.read("GISupdateInterval");
	
		
	GISUnits_makeUnitSelector("ShowParametersOption1");
	GISUnits_makeUnitSelector("ShowParametersOption2");
	GISUnits_makeUnitSelector("ShowParametersOption3");
	GISUnits_makeUnitSelector("ShowParametersOption4");
	
}

/////////////////



function GISUnits_makeUnitSelector(ShowParametersOption)
{
var unitsArray = [
		{"name":lng_Stats["nothing"], "value":"nothing"},
		{"name":lng_Stats["flik"], "value":"flik"},
		{"name":lng_Stats["wind"], "value":"wind"},
		{"name":lng_Stats["humidity"], "value":"humidity"},
		{"name":lng_Stats["pressure"], "value":"pressure"}
		]


for (i = 0; i < unitsArray.length; i++)
	{
		var sel = document.getElementById(ShowParametersOption);
		var opt = document.createElement("option");
		opt.value = unitsArray[i].value;
		opt.innerHTML = unitsArray[i].name;
		if (unitsArray[i].value == System.Gadget.Settings.read("GIS"+ShowParametersOption)) opt.selected = true; 
		sel.appendChild(opt);
	}
} 



/////////////////


function GismeteoSearchCityCode(LocCode)
{
	
	clearResults();

	var location = "http://bar.gismeteo.ru/gmbartlist.xml?r=" + Math.round(Math.random() * 10000);

	var tmp = new ActiveXObject("Microsoft.XMLHTTP");
	tmp.open("GET", location, true);
	tmp.onreadystatechange=function()
	{
		if (tmp.readyState==4)
			{
				if (tmp.Status == 200) GismeteoParseCityResults(tmp.responseXML, LocCode);
				else {document.getElementById("loccode").value = lng_NoData; return;}
			}
	}
	tmp.Send(null);
}


//////////////////


function GismeteoParseCityResults(xmlData, LocCode)
{
	if (navigator.systemLanguage == 'de-DE') {
		for (n = 0; n < CitiesGismeteoArray.length; n++) {
			if (CitiesGismeteoArray[n][0].toLowerCase().search((LocCode).toLowerCase()) > -1)
				GismeteoParseCityList(xmlData,CitiesGismeteoArray[n][1]);	
		}
	}

	else GismeteoParseCityList(xmlData,LocCode);

hide("load_indicator");	
}

/////////////////////


function GismeteoParseCityList(xmlData,searcstr)
{
	var cities = xmlData.getElementsByTagName('t');

	for (i = 0; i < cities.length; i++) {
		if ((cities[i].getAttribute('n')).toLowerCase().search((searcstr).toLowerCase()) > -1) {
		var option = document.createElement("OPTION");
		option.value = cities[i].getAttribute('i');
		if (navigator.systemLanguage == 'de-DE') {
			for (b = 0; b < CitiesGismeteoArray.length; b++) {
				if (CitiesGismeteoArray[b][1].search((cities[i].getAttribute('n'))) > -1)
					option.innerText = CitiesGismeteoArray[b][0] + ", " + lng_Countries[cities[i].getAttribute('c')];
			}
		}
		else option.innerText = cities[i].getAttribute('n') + ", " + cities[i].getAttribute('c');
		results.appendChild(option);
		}
		
	}
}
	