const User = require('../models/User');
const Product = require('../models/Product');
const Request = require('../models/Request');
const Release = require('../models/Release');
const Platform = require('../models/Platform');
const Data = require('../models/Data');
const Display = require('../models/Display');


module.exports.getAdministrate = async (req, res) => {
    try {
      const request_list = await Request.find({}, "product email name");
      const admin_list = await User.find({ "role.1": { "$exists": true } }, "email");
      const product_list = await Product.find({}, "name");
      const platform_list = await Platform.find({}, "name");
      const release_list = await Release.find({}, "toolsVersion");
  
      res.render("admin/administrate", {
        title: "Administrate",
        currentUser: req.user ? req.user : "",
        request_list,
        admin_list,
        product_list,
        platform_list,
        release_list,
        build_list: [],
        filter_tools: "",
      });
    } catch (err) {
      handleError(err);
    }
};

module.exports.postAdministrateAddProducts = async (req, res) => {
    try {
      const product_name = req.body.product_name;
      if (!product_name) {
        return res.redirect('/administrate');
      }
  
      const isProductExists = await Product.exists({ name: product_name });
      if (isProductExists) {
        return res.redirect('/administrate');
      }
  
      const product_instance = new Product({ name: product_name });
      await product_instance.save();
  
      res.redirect('/administrate');
    } catch (err) {
      console.error(err);
      res.redirect('/administrate');
    }
}
  
module.exports.postAdministrateAddAdmin = async (req, res) => {
    try {
        const admin_email = req.body.admin_email;
        if (!admin_email) {
            return res.redirect('/administrate');
        }
        await User.findOneAndUpdate({ email: admin_email },{ $pull: { role: 'admin' } });
        await User.findOneAndUpdate({ email: admin_email },{ $push: { role: 'admin' } });
        res.redirect('/administrate');
    }   catch (err) {
        console.error(err);
        res.redirect('/administrate');
    }
};

module.exports.postAdministrateApproveManager = async (req, res) => {
    try {
      const email = req.body.email;
      const product = req.body.product;
      await User.findOneAndUpdate({ email },{ $push: { owned: product }, $pull: { requested: product }});
      await User.findOneAndUpdate({ email },{ $push: { message: `Admin have approved your request to own ${product}` }});
      await Request.deleteOne({ product, email });
      res.redirect('/administrate');
    } catch (err) {
      console.error(err);
      res.redirect('/administrate');
    }
};

module.exports.postAdministrateDeclineManager = async (req, res) => {
    try {
      const email = req.body.email;
      const product = req.body.product;
      await User.findOneAndUpdate({ email },{ $pull: { requested: product } });
      await User.findOneAndUpdate({ email },{ $push: { message: `Admin have declined your request to own ${product}` }});
      await Request.deleteOne({ product, email });
      res.redirect('/administrate');
    } catch (err) {
      console.error(err);
      res.redirect('/administrate');
    }
};

/*module.exports.postAdministrateApproveManager = async (req, res) => {
    try {
      const email = req.body.email;
      const product = req.body.product;
      await User.findOneAndUpdate({ email },{ $push: { owned: product }, $pull: { requested: product }, });
      await Request.deleteOne({ product, email });
      res.redirect('/administrate');
    } catch (err) {
      console.error(err);
      res.redirect('/administrate');
    }
};

module.exports.postAdministrateDeclineManager = async (req, res) => {
    try {
      const email = req.body.email;
      const product = req.body.product;
      await User.findOneAndUpdate({ email },{ $pull: { requested: product }, $push: { message: `Admin have declined your request to own ${product}` }});
      await Request.deleteOne({ product, email });
      res.redirect('/administrate');
    } catch (err) {
      console.error(err);
      res.redirect('/administrate');
    }
}; */
  
module.exports.postAdministrateAddPlatforms = async (req, res) => {
    const platform_name = req.body.platform_name;
    if (!platform_name) {
      return res.redirect('/administrate');
    }
    try {
      const exists = await Platform.exists({ name: platform_name });
      if (exists) {
        return res.redirect('/administrate/#platform_name');
      }
      const platform_instance = new Platform({ name: platform_name });
      await platform_instance.save();
      return res.redirect('/administrate/#platform_name');
    } catch (error) {
      console.error(error);
      return res.redirect('/administrate');
    }
};

module.exports.postAdministrateAddTools = async (req, res) => {
    const tools_name = req.body.tools_name;
  
    if (!tools_name) {
      return res.redirect('/administrate');
    }
  
    try {
      const existingRelease = await Release.findOne({ toolsVersion: tools_name });
  
      if (existingRelease) {
        return res.redirect('/administrate/#tools_name');
      }
  
      const count = await Release.countDocuments();
      const releaseCode = count + 1;
  
      const release = new Release({ toolsVersion: tools_name, build: [], releaseCode });
      await release.save();
  
      return res.redirect('/administrate/#tools_name');
    } catch (err) {
      console.error(err);
      return res.redirect('/administrate');
    }
}

module.exports.postAdministratePreAddBuilds = async (req, res) => {
  try {
    const filterTools = req.body.tools_version.split("+")[0];
    const requestList = await Request.find({}, "product email");
    const adminList = await User.find({ "role.1" : { "$exists": true } }, "email");
    const productList = await Product.find({}, "name");
    const platformList = await Platform.find({}, "name");
    const releaseList = await Release.find({}, "toolsVersion");
    const builds = await Release.findOne({ toolsVersion: filterTools }, "build");
    
    console.log(builds);
    
    res.render('admin/administrate', {
      title: 'Administrate',
      currentUser: req.user || "",
      request_list: requestList,
      admin_list: adminList,
      product_list: productList,
      platform_list: platformList,
      release_list: releaseList,
      build_list: builds ? builds.build : [],
      filter_tools: filterTools
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
}


module.exports.postAdministrateAddBuilds = async (req, res) => {
  const build_name = req.body.build_name;
  const tools_version  = req.body.tools_version;

  if (!build_name) {
    return res.redirect('/administrate');
  }

  try {
    const release = await Release.findOneAndUpdate({ toolsVersion: tools_version },{ $addToSet: { build: build_name } },{ new: true });

    const code = release.releaseCode + 0.01 * release.build.length;

    // Update the Data model
    const data = await Data.findOneAndUpdate({},{ $addToSet: { codeArray: code } },{ new: true, upsert: true });
    const sortedCodes = [...data.codeArray].sort();
    const targetCode = sortedCodes.find((c) => c < code);

    // Update the Display model
    if (targetCode !== undefined) {
      const targets = await Display.find({ code: targetCode });
      const displays = targets.map((t) => ({
        code,
        product: t.product,
        platform: t.platform,
        version: t.version,
      }));
      await Display.insertMany(displays);
    }

    return res.redirect('/administrate/#tools_version');
  } catch (error) {
    console.log(error);
    return res.redirect('/administrate');
  }
};


module.exports.postAdministrateAddBuilds = async (req, res) => {
  if (!req.body.build_name) {
    return res.redirect('/administrate');
  }

  const name = req.body.build_name;
  const toolsReleaseArray = req.body.tools_version.split("+");
  const toolsVersion = toolsReleaseArray[0];

  try {
    const result1 = await Release.findOneAndUpdate({ toolsVersion }, { $pull: { build: name } });
    const result2 = await Release.findOneAndUpdate({ toolsVersion }, { $push: { build: name } });
    const code = result2.releaseCode + (0.01 * (result2.build.length + 1));
    const count = await Data.countDocuments();

    if (count) { // Any build exists
      await Data.updateOne({}, { $pull: { codeArray: code } });
      await Data.updateOne({}, { $push: { codeArray: code } });

      const exist = await Display.exists({ code });
      if (!exist) {
        const result = await Data.findOne({}, "codeArray");
        const codeArray = result.codeArray;
        codeArray.sort();
        const targetCodes = codeArray.filter(x => x < code);
        if (targetCodes.length > 0) {
          const targetCode = targetCodes[targetCodes.length - 1];
          const targetResults = await Display.find({ code: targetCode });

          targetResults.forEach((target) => {
            const display_instance = new Display({
              code: code,
              product: target.product,
              platform: target.platform,
              version: target.version
            });
            display_instance.save((err) => {
              if (err) console.log(err);
            });
          });          
        }
      }
    } else { // First build code to be inserted
      const data_instance = new Data({ codeArray: [code] });
      await data_instance.save();
    }

    res.redirect('/administrate/#tools_version');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

