//Premissions
const tablePermission = document.querySelector("[table-permissions]");

if(tablePermission){
    const buttonPermission = document.querySelector("[button-submit]");

    buttonPermission.addEventListener("click", () =>{
        let permissions = [];
        
        const rows = tablePermission.querySelectorAll("[data-name]");

        rows.forEach(row =>{
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if(name == "id"){
                inputs.forEach(input =>{
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions:[]
                    });
                });
            }else{
                inputs.forEach((input, index) =>{
                    const checked = input.checked;

                    // console.log(name);
                    // console.log(index);
                    // console.log(checked);
                    if(checked){
                        permissions[index].permissions.push(name);
                    }
                })
            };
        });

        if(permissions.length > 0){
            const formChangePermissions = document.querySelector("#form-change-permissions");

            const inputPermission = formChangePermissions.querySelector("input[name='permissions']");
            inputPermission.value = JSON.stringify(permissions);

            formChangePermissions.submit();
        }
    })
}
//End Premissions


// Permission Data Default
const dataRecords = document.querySelector("[data-records]");
if(dataRecords){
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermission = document.querySelector("[table-permissions]");

    records.forEach((record, index) =>{
        const permissions = record.permissions;
        permissions.forEach(permission =>{
            const row = tablePermission.querySelector(`[data-name="${permission}"]`);
            const input = row.querySelectorAll("input")[index];

            input.checked = true;
        });
    });
}
// End Permission Data Default

