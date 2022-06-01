class OrderUtil {
    ax;
    auth;

    //创建一个Order助手
    static async login(user, pwd) {
        let util = new OrderUtil();
        util.ax = axios.create({
            baseURL: 'http://ligong.deshineng.com:8082/brmclg/api/'
        })
        let data = (await util.ax.post(`/logon/login?time=${Date.now()}`, {
            code: user,
            password: MD5(pwd)
        })).data;

        if (data.code === 200) {
            util.auth = data.data.token;
            util.ax.defaults.headers.common["token"] = util.auth;
            util.ax.defaults.headers.common["loginid"] = data.data.loginid;
            return util;
        } else {
            return undefined
        }

    }

    //预定指定时间段
    async order(id) {
        let resp = await this.ax?.post(`/bathRoom/bookOrder?time=${Date.now()}&bookstatusid=${id}`);
        if (resp?.data.code === 200) {
            let info = resp?.data.data.bookOrderList[0]
            return {
                result: true,
                name: info.bathRoomName,
                start: new Date(info.periodStartTime),
                end: new Date(info.periodEndTime)
            };
        } else {
            return undefined
        }
    }

    async getOrderList() {
        let resp = await this.ax?.get(`/bathRoom/getBookOrderList?time=${Date.now()}`)
        let data = resp.data;
        if (data.code === 200) {
            let list = data.data.bookOrderList;
            return list
        }

    }

    async getBookList(id) {
        ///
        let resp = await this.ax?.post(`/bathRoom/listBookStatus?time=${Date.now()}&bathroomid=${id}`)
        let data = resp.data;
        if (data.code === 200) {
            let list = data.data.bookStatusList;
            return list
        }
    }

    async getRoomList() {
        ///
        let resp = await this.ax?.post(`/bathRoom/listRoom?time=${Date.now()}`)
        let data = resp.data;
        if (data.code === 200) {
            let list = data.data.bathRoomList;
            return list
        }
    }


    async getQRCode() {
        let resp = await this.ax?.post(`/bathRoom/getQcode?time=${Date.now()}`, {});
        if (resp?.data.code === 200) {
            let name = resp?.data.data.picName;
            return `http://ligong.deshineng.com:8082/brmclg/download/${name[name.toString().length - 1]}/${name}.jpg`
        }
        return undefined
    }

    async cancel(id) {
        //
        let resp = await this.ax?.post(`/bathRoom/cancelOrder?time=${Date.now()}&bookorderid=${id}`, {});
        if (resp?.data.code === 200) {
            return true
        }
        return undefined
    }
}