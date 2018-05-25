class GitHubClient {
	/*  dependency injection  */
	constructor(superagent) {
		this.superagent = superagent;
    }


    /* Github redirect to login */
    routing_toLogin(GITHUB_CLIENT_ID,errors,res){
        res.render('login', { client_id :  GITHUB_CLIENT_ID, 
                              errors : errors});
        
    }
    
    /* Github Oauth callback   */
    routing_callback(req,res,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET,GITHUB_CODE) {
		return this.superagent
			//.query({ format: 'json' })
            .post(`https://github.com/login/oauth/access_token`)
            .send({     "client_id" : GITHUB_CLIENT_ID,
                        "client_secret" : GITHUB_CLIENT_SECRET,
                        "code" : GITHUB_CODE,
                        "accept" : "json"
                    })
			.then((response) => {
                if(response.body.scope == 'user:email'){
                    console.log("User is correcting logged, with permission user:email");
                    req.session.login = true;
                    res.redirect('/');
                }else{
                    console.log("error");
                    console.log(response.body);
                    this.routing_toLogin(GITHUB_CLIENT_ID,body.error_description,res);
                }
            })
            .catch((err) => {
                console.log(err);
                this.routing_toLogin(GITHUB_CLIENT_ID,err,res);
			});

    }
    /* Routig managing for Search form */
    routing_search(res,queryRequest){
        this.gh_search(queryRequest,res)
			.then((reply) => {
				res.render('index', { formdata: reply.pageData, results: reply.json, errors : ""});
			})
			.catch((err) => {
				res.render('index', { formdata: reply.pageData, results: reply.json , errors : [err]});
			})
    }
    /* Create PageData Object that will allow the form to mantain parameters */
    createPageData(query){
        let queryRequest = "";
        let pageData = {};
        
        pageData.user =  query.u;
        pageData.repos =  isNaN(parseInt(query.r)) ? 0 : parseInt(query.r);
        pageData.follower =  isNaN(parseInt(query.f)) ? 0 : parseInt(query.f); 
        
        return pageData
    }

    /* build Github API Search Query */
	buildSearchQuery(query) {
		let queryRequest = "";

		if (!!query.u) {
			queryRequest = "q=" + query.u;
		}
		if (!!query.r) {
			queryRequest = queryRequest + "+repos:>" + query.r;
		}
		if (!!query.f) {
			queryRequest = queryRequest + "+followers:>" + query.f;
		}

		return queryRequest
    }

    /* Call Gihub API for search users */
	gh_search(queryRequest) {
		return this.superagent
			.get(`https://api.github.com/search/users?${this.buildSearchQuery(queryRequest)}`)
			.set({
				'User-Agent': 'Awesome-Octocat-App', //mondatory: need an User-Agent as per github documentation)
				'Accept': 'application/vnd.github.v3.text-match+json'
			})
			.then((res) => {
                return { 
                         "json" : JSON.parse(res.text),
                         "pageData" : this.createPageData(queryRequest)
                        }

			});

	}

}


module.exports = GitHubClient