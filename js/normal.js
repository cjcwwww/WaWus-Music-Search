window.onload = function () {
    function clearResults() {
        document.getElementById("search-result-json-text").value = "";
        document.getElementById("search-result-final-2").innerHTML = "";
        $("#search-result-final-number").text("")
    }
    function checkURL(url) {
        return urlpattern.test(url);
    }
    const urlpattern = /^((https|http|ftp|rtsp|mms)?:\/\/)\S+/;
    var searchPage = 1
    const userbtn = document.getElementById("search-button");
    userbtn.onclick = function (event) { // 添加 event 参数
        event.preventDefault(); // 阻止表单默认提交行为
        let usertext = document.getElementById("search-text").value;
        if (usertext === "") {
            alert("请输入要搜索的内容！");
            return false;
        } else {
            document.getElementById("search-result").style.display = "block";
            clearResults();
            $.ajax({
                url: "https://api.xingzhige.com/API/QQmusicVIP/",
                type: "GET",
                method: "GET",
                dataType: "json",
                data: {
                    name: usertext,
                    page: searchPage,
                    key: "56yDmhgLkekZTW5Kl6UaKbV6NotWh8S_mrn7uxkDo8I="
                    //此为作者提供的密钥，切勿盗取！
                },
                success: function (data) {
                    console.log("已发送请求！");
                    switch (data.code) {
                        case 0 :
                            console.log("请求成功！")
                            document.getElementById("search-result-json-text").value = JSON.stringify(data, null, 4);
                            const datalength = data.data.length;
                            console.log("本次搜索到了" + datalength + "条数据！");
                            const searchresultfinal2 = $("#search-result-final-2")
                            searchresultfinal2.append("<p style='font-size: 0.7em;margin-top: 6px;margin-left: 7px;'>本次搜索到了" + datalength + "条数据！</p><br>");
                            for (let i = 0; i < datalength; i++) {
                                const data1 = data.data[i];
                                //歌曲名
                                const songname = data1.songname;
                                //歌曲链接
                                const songurl = data1.songurl;
                                //作者名
                                const songauthor = data1.name;
                                searchresultfinal2.append("<p style='font-size: 0.7em;margin-top: 6px;margin-left: 7px;'>" + (i + 1) + "、" + songname + " - " + songauthor + " - " + songurl + "</p>")
                                document.getElementById("search-result-quick-choose").style.display = "block";
                            }
                            break;
                        case 400 || 403 || 405 || 408 || 500 || 501 || 503 :
                            console.log("系统级错误error！服务器返回: " + data.msg);
                            document.getElementById("search-result-json-text").innerText = "请求失败！错误信息请见控制台输出！";
                            break;
                        case -100 || -101 || -102 || -103 || -200 || -201 || -202 :
                            console.log("用户级错误error！服务器返回: " + data.msg);
                            document.getElementById("search-result-json-text").innerText = "请求失败！错误信息请见控制台输出！";
                            break;
                        default:
                            console.log("未知错误error！服务器返回: " + data.msg);
                            document.getElementById("search-result-json-text").innerText = "请求失败！错误信息请见控制台输出！";
                            break;
                    }
                },
                error: function (xhr, status, error) {
                    console.log("请求失败……：" + error);
                },
            });
        }
    }
    $("#search-result-quick-choose-btn").on("click",function () {
        clearResults();
        let usertext = document.getElementById("search-text").value;
        $.ajax({
            url: "https://api.xingzhige.com/API/QQmusicVIP/",
            type: "GET",
            method: "GET",
            dataType: "json",
            data: {
                name: usertext,
                page: searchPage,
                n:$("#search-result-quick-choose-select").val(),
                key: "56yDmhgLkekZTW5Kl6UaKbV6NotWh8S_mrn7uxkDo8I="
                //此为作者提供的密钥，切勿盗取！
            },
            success: function (data) {
                console.log("已发送请求！");
                $("#search-result-quick-choose").css("display","none")
                switch (data.code) {
                    case 0 :
                        console.log("请求成功！");
                        console.log(data)
                        document.getElementById("search-result-json-text").value = JSON.stringify(data, null, 4);
                        const finaltextbox = document.getElementById("search-result-final-2");
                        const songimg = data.data.cover;
                        const songname = data.data.songname;
                        const songurl = data.data.src;
                        const songauthor = data.data.name;
                        const songalbum = data.data.album;
                        const songqqurl = data.data.songurl;
                        const songimgHTML = "<img src='" + songimg + "' alt='"+ songname +"' class='song-img'/>";
                        const songnameHTML = "<h2 class='song-name' title='"+songname+"'>" + songname + "</h2><br>";
                        const songauthorHTML = "<h3 class='song-data-author' title='"+songauthor+"'>" + songauthor + "</h3><br>";
                        const songalbumHTML = "<h3 class='song-data-album' title='"+songalbum+"'>" + songalbum + "</h3>";
                        const songdataHTML = "<div class='song-data'>" + songnameHTML + songauthorHTML + songalbumHTML + "</div>";
                        const songqqurlHTML = "<input type='button' value='QQ音乐链接' class='qqurlbtn'/>";
                        if(checkURL(songurl)){
                            const songurlfinal= "<audio src='" + songurl + "' controls class='song-url-audio'></audio>";
                            const songurlboxHTML = "<div class='song-url'>" + songurlfinal + songqqurlHTML + "</div>";
                            finaltextbox.innerHTML = songimgHTML + songdataHTML + songurlboxHTML;
                            $(".song-name,.song-data-author,.song-data-album").dotdotdot();
                            $(".qqurlbtn").on("click",function () {
                                window.open(songqqurl);
                            })
                        }
                        else{
                            const songurlfinal = "<p class='song-url'>"+songurl+"</p>";
                            const songurlboxHTML = "<div class='song-url'>" + songurlfinal + songqqurlHTML + "</div>";
                            finaltextbox.innerHTML = songimgHTML + songdataHTML + songurlboxHTML;
                            $(".song-name,.song-data-author,.song-data-album").dotdotdot();
                            $(".qqurlbtn").on("click",function () {
                                window.open(songqqurl);
                            })
                        }
                        break;
                    case 400 || 403 || 405 || 408 || 500 || 501 || 503 :
                        console.log("系统级错误 " + data.code +"error！" + "服务器返回: " + data.msg);
                        document.getElementById("search-result-json-text").innerText = "请求失败！错误信息请见控制台输出！";
                        break;
                    case -100 || -101 || -102 || -103 || -200 || -201 || -202 :
                        console.log("用户级错误 " + data.code + "error！" + "服务器返回: " + data.msg);
                        document.getElementById("search-result-json-text").innerText = "请求失败！错误信息请见控制台输出！";
                        break;
                    default:
                        console.log("未知错误error！服务器返回: " + data.msg);
                        break;
                }
            },
            error: function (xhr, status, error) {
                console.log("请求失败……：" + error);
            },
        })
        usertext.value = "";
    })
}