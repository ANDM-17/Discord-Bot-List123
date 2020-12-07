const { Router } = require("express");
const { auth } = require('@utils/discordApi')
const Bots = require("@models/bots");

const { server: { role_ids: { bot_verifier } }, server: { admin_user_ids, id } } = require("@root/config.json")

const route = Router();

route.get("/", auth, async (req, res) => {
    const staffcheck = await req.app.get('client').guilds.cache.get(id).members.cache.get(req.user.id).roles.cache.has(bot_verifier);
    if (!admin_user_ids.includes(req.user.id) && !staffcheck) return res.render("403", { user: req.user });
    let bots = await Bots.find({ state: "unverified" }, { _id: false })
    if (bots == '') {
        bots = null
    }
    res.render("admin", { user: req.user, bots: bots, id: id });
});

module.exports = route;
