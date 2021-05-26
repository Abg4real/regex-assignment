const fs = require('fs');
const { parse } = require('node-html-parser');

fs.readFile('./sample-example.html',(err,data)=>{
    let fileContent = data.toString();
    let reducedValues = fileContent.replace(/>(\s|\n)*</g,"><").replace(/ {2,}/g,"");
    let headValues = reducedValues.match(/<th>(.|\n|\s)*?<\/th>/g).map((th)=>{
        newValue = th.replace(/\n/g,"").replace(/<\/?th>/g,"");
        if(newValue[0]=='<'){
            const tag = parse(newValue);
            return tag.firstChild.innerText;
        }
        return newValue;
    });
    let line = '';
    headValues.forEach(value=>{
        line += value;
        if(!(value==headValues[headValues.length - 1])){
            line+=',';
        }
    })
    fs.writeFile('./output.csv',line+"\n",err=>{
        console.log(err)
    });
    reducedValues = reducedValues.match(/<tbody>(.|\n)*?<\/tbody>/g)[0];
    let rows = reducedValues.match(/<tr>(.|\n)*?<\/tr>/g);
    // console.log(rows[0]);
    rows.forEach((row)=>{
        let rowValues = row.match(/<td class="filterable-cell( completed| available| confirmed)?">(.|\n)*?<\/td>/g).map((td)=>{
            newValue = td.replace(/\n/g,"").replace(/<\/?td>/g,"").replace(/,/g,'');
            if(newValue[0]=='<'){
                const tag = parse(newValue);
                return tag.firstChild.innerText;
            }
            return newValue;
        })
        let string = '';
        rowValues.forEach((value)=>{
            string+=value;
            if(!(value==rowValues[rowValues.length - 1])){
                string+=',';
            }
        })
        fs.appendFile('./output.csv',string + "\n",err=>console.log(err));
    })
})