module.exports = {
    disable: false,
    name: "setup",
    aliases: ["초기설정"],
    args: 0,
    usage: [""],
    description: "면접 초기 설정을 합니다.",
    help: true,
    execute(message, args) {
        const { getDataFromRow } = require("../index");
        const roles = require("../roles.json");
        const channels = require("../channels.json");

        var user,
            nullUser = new Array();
        for (let i = 2; (user = getDataFromRow(i)); i++) {
            var success = false;
            message.guild.members.cache.some((value, index, array) => {
                if (
                    value.user.tag.split("#")[1] === user.discord.split("#")[1]
                ) {
                    value.setNickname(`${user.index} ${user.name}`);
                    value.roles.add(roles.newcomer);
                    value.roles.add(roles.waiting);
                    console.log(`[~] User: ${user.index} ${user.name}`);
                    success = true;
                }
            });
            if (!success) {
                nullUser.push(`${user.index} ${user.name}`);
            }

            var channelExists = false;
            message.guild.channels.cache.some((value) => {
                if (
                    value.name == `${user.index}-${user.name}` &&
                    value.parentID === channels.interview_memo
                ) {
                    channelExists = true;
                }
            });
            if (!channelExists) {
                message.guild.channels.create(`${user.index}-${user.name}`, {
                    type: "text",
                    parent: channels.interview_memo,
                });
            }
        }

        if (nullUser.length) {
            message.reply(
                `아직 들어오지 않은 학생\n\`\`\`${nullUser.join("\n")}\`\`\``
            );
        } else {
            message.reply("전부 설정되었습니다!");
        }
    },
};
