class GitHubClient {
    /*  dependency injection  */
    constructor(superagent) {
        this.superagent = superagent;
    }


    /* Github redirect to login */
    /* 
        Github Oauth callback   

        Example of success from API 
        { access_token: '1375365c3a652d996d74a4beff1d9da91e344e83',
            scope: 'user:email',
            token_type: 'bearer' }

        Example of error from API
        { error: 'bad_verification_code',
          error_description: 'The code passed is incorrect or expired.',
          error_uri: 'https://developer.github.com/apps/managing-oauth-apps/troubleshooting-oauth-app-access-token-request-errors/#bad-verification-code' }

    */

    oAuthAccessToken(client_id, client_secret, code) {
        return this.superagent
            .post(`https://github.com/login/oauth/access_token`)
            .send({
                client_id,
                client_secret,
                code,
                "accept": "json"
            })
            .then((response) => {
                console.log('GitHubClient::oAuthAccessToken() success', response.body)
                console.log("Callback response");
                console.log(response.body);
                console.log("-----");

                /* 
                    github API return a 200 if access token is wrong, let manage this scenatio here
                */
               
                if(response.hasOwnProperty('error')){
                    return Promise.reject(response.error)
                }else{
                    return response
                }

              
            })
            .catch((err) => {
                console.log('GitHubClient::oAuthAccessToken() success', response.err)
                return Promise.reject(err)

            })

    }

    /* Create PageData Object that will allow the form to mantain parameters */
    createPageData(query) {
        let queryRequest = "";
        let pageData = {};

        pageData.user = query.u;
        pageData.repos = isNaN(parseInt(query.r)) ? 0 : parseInt(query.r);
        pageData.follower = isNaN(parseInt(query.f)) ? 0 : parseInt(query.f);

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
    userSearch(queryRequest) {
        return this.superagent
            .get(`https://api.github.com/search/users?${this.buildSearchQuery(queryRequest)}`)
            .set({
                'User-Agent': 'Awesome-Octocat-App', //mondatory: need an User-Agent as per github documentation)
                'Accept': 'application/vnd.github.v3.text-match+json'
            })
            .then((res) => {
                return {
                    "json": JSON.parse(res.text),
                    "pageData": this.createPageData(queryRequest)
                }

            });

    }

}


module.exports = GitHubClient