const deepCopyFunction = inObject =>
{
    let outObject, value, key

    if(typeof inObject !== "object" || inObject === null)
    {
        return inObject
    }
  
    outObject = Array.isArray(inObject) ? [] : {}
  
    for (key in inObject)
    {
        value = inObject[key]
        
    outObject[key] = (typeof value === "object" && value !== null) ? deepCopyFunction(value) : value
    }
  
    return outObject
}

var wordsearch_size = 1
var wordsearch_words = []
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var wordsearch_diagonal;
var wordsearch = [];
var wordsearch_answer_key = [];
var intersect_offset = 0.9;
var limit;
var limit_counter = 1;
var error = false;

document.getElementById("sizeInput").value = wordsearch_size;
document.getElementById("wordsInput").value = wordsearch_words;

for(var n = 0; n < alphabet.length; n++)
{
    var img = document.createElement("img");
    img.src = "images/" + alphabet[n] + ".png";
    img.id = alphabet[n];
    document.getElementById("images").appendChild(img);
}

function createWordSearch()
{
    wordsearch_words = document.getElementById("wordsInput").value.toUpperCase().replace(/ /g, "").split(",");
    
    for(var n = 0; n < wordsearch_words.length; n++)
    {
        if(!wordsearch_words[n].match(/[a-z]/i) && wordsearch_words[n] !== "")
        {
            clear();
            alert("Words can only be of English letters.");
            return;
        }
        
        var reversed_word = "";
        
        for(var o = 0; o < wordsearch_words[n].length; o++)
        {
            reversed_word += wordsearch_words[n].charAt(wordsearch_words[n].length - o - 1);
        }
    
        for(var m = n + 1; m < wordsearch_words.length; m++)
        {
            if(wordsearch_words[n] === wordsearch_words[m])
            {
                clear();
                alert("You cannot use the same word more than once.");
                return;
            }
            
            if(reversed_word === wordsearch_words[m])
            {
                clear();
                alert("You cannot have palindrome words.");
                return;
            }
        }
    }
    
    wordsearch_size = document.getElementById("sizeInput").value;
    
    if(wordsearch_size < 1 || Math.floor(wordsearch_size) != wordsearch_size)
    {
        clear();
        alert("Word search size is invalid.");
        return;
    }
    
    document.getElementById("sizeInput").value = wordsearch_size;
    
    limit = Math.pow(wordsearch_size, 2) * 1000;
    
    wordsearch_diagonal = document.getElementById("diagonalInput").checked;
    wordsearch = [];
    wordsearch_answer_key = [];
    error = false;
    
    for(var n = 0; n < wordsearch_size; n++)
    {
        wordsearch.push([]);
    }
    
    for(var n = 0; n < wordsearch_words.length; n++)
    {
        wordsearch_answer_key.push([]);
    }
    
    limit_counter = 1;
    
    wordloop:
    for(var n = 0; n < wordsearch_words.length; n++)
    {
        var word = wordsearch_words[n];
        
        var x = Math.round(Math.random() * (wordsearch_size - 1));
        var y = Math.round(Math.random() * (wordsearch_size - 1));
        
        var direction_x;
        var direction_y;
        
        if(wordsearch_diagonal === false)
        {
            direction_x = Math.round(Math.random()) * 2 - 1;
            direction_y = 0;
        }
        
        else
        {
            direction_x = Math.round(Math.random() * 2 - 1);
            direction_y = Math.round(Math.random()) * 2 - 1;
        }
        
        if(Math.round(Math.random()) == 0)
        {
            var temp = direction_x;
            direction_x = direction_y;
            direction_y = temp;
        }
        
        var character_list = [];
        var flag = false;
        var intersect_flag = false;
        
        characterloop:
        for(var m = 0; m < word.length; m++)
        {
            if(m > 0)
            {
                x += direction_x;
                y += direction_y;
                
                if(x < 0 || x > wordsearch_size - 1 || y < 0 || y > wordsearch_size - 1)
                {
                    limit_counter++;
                    flag = true;
                    break characterloop;
                }
            }
            
            if(wordsearch[x][y] !== undefined && word.charAt(m) != wordsearch[x][y])
            {
                limit_counter++;
                flag = true;
                break characterloop;
            }
            
            if(word.charAt(m) == wordsearch[x][y])
            {
                intersect_flag = true;
            }
            
            character_list.push([x, y]);
        }
        
        if(intersect_flag === false && Math.random() < intersect_offset)
        {
            limit_counter++;
            flag = true;
        }
        
        if(limit_counter > limit)
        {
            error = true;
            break;
        }
        
        if(flag)
        {
            n--;
        }
        
        else
        {
            wordsearch_answer_key[n] = character_list;
            
            for(var m = 0; m < character_list.length; m++)
            {
                wordsearch[character_list[m][0]][character_list[m][1]] = word.charAt(m);
            }
            
            limit_counter = 1;
        }
    }
    
    if(!error)
    {
        for(var n = 0; n < wordsearch.length; n++)
        {
            for(var m = 0; m < wordsearch.length; m++)
            {
                if(typeof wordsearch[n][m] === "undefined")
                {
                    wordsearch[n][m] = alphabet.charAt(Math.random() * (alphabet.length - 1));
                }
            }
        }
        
        render();                    
    }
    
    else
    {
        alert("Word search could not be created.\nHint: Try increasing the wordsearch size.");
    }
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var line_width = 2;

var canvas_answer_key = document.getElementById("canvas-answer-key");
var ctx_answer_key = canvas_answer_key.getContext("2d");

function render()
{
    canvas.width = wordsearch_size * 100;
    canvas.height = wordsearch_size * 100;
    canvas_answer_key.width = canvas.width;
    canvas_answer_key.height = canvas.height;
    clear();
    ctx.font = "15px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    
    for(var x = 0; x < wordsearch.length; x++)
    {
        for(var y = 0; y < wordsearch.length; y++)
        {
            ctx.drawImage(document.getElementById(wordsearch[x][y]), 100 * x, 100 * y);
        }
    }
    
    for(var n = 1; n < wordsearch.length; n++)
    {
        ctx.fillRect(100 * n - line_width / 2, 0, line_width, canvas.height);
        ctx.fillRect(0, 100 * n - line_width / 2, canvas.width, line_width);
    }
    
    ctx.fillRect(0, 0, canvas.width, line_width);
    ctx.fillRect(canvas.width - line_width, 0, line_width, canvas.height);
    ctx.fillRect(0, canvas.height - line_width, canvas.width, line_width);
    ctx.fillRect(0, 0, line_width, canvas.height);
    
    ctx_answer_key.drawImage(canvas, 0, 0);
    
    for(var n = 0; n < wordsearch_answer_key.length; n++)
    {
        if(wordsearch_answer_key[n].length >= 1)
        {
            var x1 = 100 * wordsearch_answer_key[n][0][0] + 50;
            var y1 = 100 * wordsearch_answer_key[n][0][1] + 50;
            var x2 = 100 * wordsearch_answer_key[n][wordsearch_answer_key[n].length - 1][0] + 50;
            var y2 = 100 * wordsearch_answer_key[n][wordsearch_answer_key[n].length - 1][1] + 50;
            var a = Math.atan2(y2 - y1, x2 - x1);
            
            ctx_answer_key.beginPath();
            ctx_answer_key.arc(x1, y1, 50, Math.PI + a - Math.PI / 2, Math.PI + a + Math.PI / 2);
            ctx_answer_key.arc(x2, y2, 50, a - Math.PI / 2, a + Math.PI / 2);
            ctx_answer_key.closePath();
            ctx_answer_key.globalAlpha = 0.5;
            ctx_answer_key.fillStyle = "hsl(" + (n / wordsearch_answer_key.length * 360) + ", 100%, 50%)";
            ctx_answer_key.fill();
        }
    }
    
    for(var n = 0; n < document.querySelectorAll(".hidden").length; n++)
    {
        document.getElementsByClassName("hidden")[n].style.visibility = "visible";
        document.getElementsByClassName("hidden")[n].style.pointerEvents = "auto";
    }
}

function clear()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx_answer_key.clearRect(0, 0, canvas_answer_key.width, canvas_answer_key.height);
    
    for(var n = 0; n < document.querySelectorAll(".hidden").length; n++)
    {
        document.getElementsByClassName("hidden")[n].style.visibility = "hidden";
        document.getElementsByClassName("hidden")[n].style.pointerEvents = "none";
    }
}

function loadExample()
{
    document.getElementById("sizeInput").value = 5;
    document.getElementById("wordsInput").value = "cat, bat, sat, mat, rat";
    document.getElementById("sure").remove();
    document.getElementById("load").remove();
}
