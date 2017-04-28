# qewd-hl72json: ransforms HL7 messages to JSON
 
Rob Tweed <rtweed@mgateway.com>  
25 January 2017, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

## Installing

       npm install qewd-hl72json
	   
## Using qewd-hl72json

*qewd-hl72json* parses HL7 messages and makes use of the 
  [*hl7-dictionary*](https://github.com/fernandojsg/hl7-dictionary) module to
  convert the message into JSON

  Each line in the HL7 message must be separated by new-line ('\n') characters.

## Example

      var hl72json = require('qewd-hl72json');
      var hl7 = 'MSH|^~\&|LCS|LCA|LIS|TEST9999|199807311532||ORU^R01|3629|P|2.2';
      hl7 = hl7 + '\n\ + 'PID||0493575^^^2^ID 1|454721||DOE^JOHN^^^^|DOE^JOHN^^^^|19480203|M||B|254 MYSTREET AVE^^MYTOWN^OH^44123^USA||(216)123-4567|||M|NON|400003403~1129086|';
      hl7 = hl7 + '\n\ + 'ORC|NW|8642753100012^LIS|20809880170^LCS||||||19980727000000|||HAVILAND';
      hl7 = hl7 + '\n\ + 'OBR|1|8642753100012^LIS|20809880170^LCS|008342^UPPER RESPIRATORY CULTURE^L|||19980727175800||||||SS#634748641 CH14885 SRC:THROA SRC:PENI|19980727000000||||||20809880170||19980730041800||BN|F';
      hl7 = hl7 + '\n\ + 'OBX|1|ST|008342^UPPER RESPIRATORY CULTURE^L||FINALREPORT|||||N|F||| 19980729160500|BN';
      hl7 = hl7 + '\n\ + 'ORC|NW|8642753100012^LIS|20809880170^LCS||||||19980727000000|||HAVILAND';
      hl7 = hl7 + '\n\ + 'OBR|2|8642753100012^LIS|20809880170^LCS|997602^.^L|||19980727175800||||G|||19980727000000||||||20809880170||19980730041800|||F|997602|||008342';
      hl7 = hl7 + '\n\ + 'OBX|2|CE|997231^RESULT 1^L||M415|||||N|F|||19980729160500|BN';
      hl7 = hl7 + '\n\ + 'NTE|1|L|MORAXELLA (BRANHAMELLA) CATARRHALIS';
      hl7 = hl7 + '\n\ + 'NTE|2|L| HEAVY GROWTH';
      hl7 = hl7 + '\n\ + 'NTE|3|L| BETA LACTAMASE POSITIVE';
      hl7 = hl7 + '\n\ + 'OBX|3|CE|997232^RESULT 2^L||MR105|||||N|F|||19980729160500|BN';
      hl7 = hl7 + '\n\ + 'NTE|1|L|ROUTINE RESPIRATORY FLORA';

      // convert against HL7 v2.5 dictionary

      var json = hl72json(hl7, '2.5');


## License

 Copyright (c) 2017 M/Gateway Developments Ltd,                           
 Redhill, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.      
