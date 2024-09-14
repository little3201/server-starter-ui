import { http, HttpResponse } from 'msw'
import type { Table, Column, Code } from 'src/models'

const datas: Table[] = [
]

for (let i = 1; i < 28; i++) {
  const data: Table = {
    id: i,
    name: 'table_name' + i,
    comment: '表名称_' + i,
    description: 'this is description for this row'
  }
  datas.push(data)
}

const columnDatas: Column[] = []

for (let i = 1; i < 28; i++) {
  const data: Column = {
    id: i,
    name: 'column_name' + i,
    comment: '属性名称_' + i,
    type: 'varchar',
    length: 255,
    nullable: i % 3 > 0,
    unique: i < 3,
    description: 'this is description for this row'
  }
  columnDatas.push(data)
}

const codes: Code[] = [
  {
    "name": "Index",
    "content": "<template>\n  <div class=\"app-container\">\n    <!--工具栏-->\n    <div class=\"head-container\">\n      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->\n      <crudOperation :permission=\"permission\" />\n      <!--表单组件-->\n      <el-dialog :close-on-click-modal=\"false\" :before-close=\"crud.cancelCU\" :visible.sync=\"crud.status.cu > 0\" :title=\"crud.status.title\" width=\"500px\">\n        <el-form ref=\"form\" :model=\"form\" :rules=\"rules\" size=\"small\" label-width=\"80px\">\n          <el-form-item label=\"用户ID\" prop=\"userId\">\n            未设置字典，请手动设置 Select\n          </el-form-item>\n          <el-form-item label=\"岗位ID\" prop=\"jobId\">\n            未设置字典，请手动设置 Select\n          </el-form-item>\n        </el-form>\n        <div slot=\"footer\" class=\"dialog-footer\">\n          <el-button type=\"text\" @click=\"crud.cancelCU\">取消</el-button>\n          <el-button :loading=\"crud.status.cu === 2\" type=\"primary\" @click=\"crud.submitCU\">确认</el-button>\n        </div>\n      </el-dialog>\n      <!--表格渲染-->\n      <el-table ref=\"table\" v-loading=\"crud.loading\" :data=\"crud.data\" size=\"small\" style=\"width: 100%;\" @selection-change=\"crud.selectionChangeHandler\">\n        <el-table-column type=\"selection\" width=\"55\" />\n        <el-table-column prop=\"userId\" label=\"用户ID\" />\n        <el-table-column prop=\"jobId\" label=\"岗位ID\" />\n        <el-table-column v-if=\"checkPer(['admin','sysUsersJobs:edit','sysUsersJobs:del'])\" label=\"操作\" width=\"150px\" align=\"center\">\n          <template slot-scope=\"scope\">\n            <udOperation\n              :data=\"scope.row\"\n              :permission=\"permission\"\n            />\n          </template>\n        </el-table-column>\n      </el-table>\n      <!--分页组件-->\n      <pagination />\n    </div>\n  </div>\n</template>\n\n<script>\nimport crudSysUsersJobs from '@/api/sysUsersJobs'\nimport CRUD, { presenter, header, form, crud } from '@crud/crud'\nimport rrOperation from '@crud/RR.operation'\nimport crudOperation from '@crud/CRUD.operation'\nimport udOperation from '@crud/UD.operation'\nimport pagination from '@crud/Pagination'\n\nconst defaultForm = { userId: null, jobId: null }\nexport default {\n  name: 'SysUsersJobs',\n  components: { pagination, crudOperation, rrOperation, udOperation },\n  mixins: [presenter(), header(), form(defaultForm), crud()],\n  cruds() {\n    return CRUD({ title: 'bannerInter', url: 'api/sysUsersJobs', idField: 'jobId', sort: 'jobId,desc', crudMethod: { ...crudSysUsersJobs }})\n  },\n  data() {\n    return {\n      permission: {\n        add: ['admin', 'sysUsersJobs:add'],\n        edit: ['admin', 'sysUsersJobs:edit'],\n        del: ['admin', 'sysUsersJobs:del']\n      },\n      rules: {\n        userId: [\n          { required: true, message: '用户ID不能为空', trigger: 'blur' }\n        ],\n        jobId: [\n          { required: true, message: '岗位ID不能为空', trigger: 'blur' }\n        ]\n      }    }\n  },\n  methods: {\n    // 钩子：在获取表格数据之前执行，false 则代表不获取数据\n    [CRUD.HOOK.beforeRefresh]() {\n      return true\n    }\n  }\n}\n</script>\n\n<style scoped>\n\n</style>\n"
  },
  {
    "name": "api",
    "content": "import request from '@/utils/request'\n\nexport function add(data) {\n  return request({\n    url: 'api/sysUsersJobs',\n    method: 'post',\n    data\n  })\n}\n\nexport function del(ids) {\n  return request({\n    url: 'api/sysUsersJobs/',\n    method: 'delete',\n    data: ids\n  })\n}\n\nexport function edit(data) {\n  return request({\n    url: 'api/sysUsersJobs',\n    method: 'put',\n    data\n  })\n}\n\nexport default { add, edit, del }\n",
  },
  {
    "name": "Domain",
    "content": "/*\n*  Copyright 2024 Leafage\n*\n*  Licensed under the Apache License, Version 2.0 (the \"License\");\n*  you may not use this file except in compliance with the License.\n*  You may obtain a copy of the License at\n*\n*  http://www.apache.org/licenses/LICENSE-2.0\n*\n*  Unless required by applicable law or agreed to in writing, software\n*  distributed under the License is distributed on an \"AS IS\" BASIS,\n*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n*  See the License for the specific language governing permissions and\n*  limitations under the License.\n*/\npackage com.banner.domain;\n\nimport lombok.Data;\nimport cn.hutool.core.bean.BeanUtil;\nimport io.swagger.annotations.ApiModelProperty;\nimport cn.hutool.core.bean.copier.CopyOptions;\nimport javax.persistence.*;\nimport javax.validation.constraints.*;\nimport java.io.Serializable;\n\n/**\n* @website https://eladmin.vip\n* @description /\n* @author robbie\n* @date 2024-08-31\n**/\n@Entity\n@Data\n@Table(name=\"sys_users_jobs\")\npublic class SysUsersJobs implements Serializable {\n\n    @Id\n    @Column(name = \"`user_id`\")\n    @ApiModelProperty(value = \"用户ID\")\n    private Long userId;\n\n    @Id\n    @Column(name = \"`job_id`\")\n    @ApiModelProperty(value = \"岗位ID\")\n    private Long jobId;\n\n    public void copy(SysUsersJobs source){\n        BeanUtil.copyProperties(source,this, CopyOptions.create().setIgnoreNullValue(true));\n    }\n}\n"
  },
  {
    "name": "Dto",
    "content": "/*\n*  Copyright 2024 Leafage\n*\n*  Licensed under the Apache License, Version 2.0 (the \"License\");\n*  you may not use this file except in compliance with the License.\n*  You may obtain a copy of the License at\n*\n*  http://www.apache.org/licenses/LICENSE-2.0\n*\n*  Unless required by applicable law or agreed to in writing, software\n*  distributed under the License is distributed on an \"AS IS\" BASIS,\n*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n*  See the License for the specific language governing permissions and\n*  limitations under the License.\n*/\npackage com.banner.service.dto;\n\nimport lombok.Data;\nimport java.io.Serializable;\nimport com.alibaba.fastjson.annotation.JSONField;\nimport com.alibaba.fastjson.serializer.ToStringSerializer;\n\n/**\n* @website https://eladmin.vip\n* @description /\n* @author robbie\n* @date 2024-08-31\n**/\n@Data\npublic class SysUsersJobsDto implements Serializable {\n\n    /** 用户ID */\n    /** 防止精度丢失 */\n    @JSONField(serializeUsing = ToStringSerializer.class)\n    private Long userId;\n\n    /** 岗位ID */\n    /** 防止精度丢失 */\n    @JSONField(serializeUsing = ToStringSerializer.class)\n    private Long jobId;\n}"
  },
  {
    "name": "Controller",
    "content": "/*\n*  Copyright 2024 Leafage\n*\n*  Licensed under the Apache License, Version 2.0 (the \"License\");\n*  you may not use this file except in compliance with the License.\n*  You may obtain a copy of the License at\n*\n*  http://www.apache.org/licenses/LICENSE-2.0\n*\n*  Unless required by applicable law or agreed to in writing, software\n*  distributed under the License is distributed on an \"AS IS\" BASIS,\n*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n*  See the License for the specific language governing permissions and\n*  limitations under the License.\n*/\npackage com.banner.rest;\n\nimport me.zhengjie.annotation.Log;\nimport com.banner.domain.SysUsersJobs;\nimport com.banner.service.SysUsersJobsService;\nimport com.banner.service.dto.SysUsersJobsQueryCriteria;\nimport org.springframework.data.domain.Pageable;\nimport lombok.RequiredArgsConstructor;\nimport org.springframework.http.HttpStatus;\nimport org.springframework.http.ResponseEntity;\nimport org.springframework.security.access.prepost.PreAuthorize;\nimport org.springframework.validation.annotation.Validated;\nimport org.springframework.web.bind.annotation.*;\nimport io.swagger.annotations.*;\nimport java.io.IOException;\nimport javax.servlet.http.HttpServletResponse;\nimport me.zhengjie.utils.PageResult;\nimport com.banner.service.dto.SysUsersJobsDto;\n\n/**\n* @website https://eladmin.vip\n* @author robbie\n* @date 2024-08-31\n**/\n@RestController\n@RequiredArgsConstructor\n@Api(tags = \"bannerInter管理\")\n@RequestMapping(\"/api/sysUsersJobs\")\npublic class SysUsersJobsController {\n\n    private final SysUsersJobsService sysUsersJobsService;\n\n    @Log(\"导出数据\")\n    @ApiOperation(\"导出数据\")\n    @GetMapping(value = \"/download\")\n    @PreAuthorize(\"@el.check('sysUsersJobs:list')\")\n    public void exportSysUsersJobs(HttpServletResponse response, SysUsersJobsQueryCriteria criteria) throws IOException {\n        sysUsersJobsService.download(sysUsersJobsService.queryAll(criteria), response);\n    }\n\n    @GetMapping\n    @Log(\"查询bannerInter\")\n    @ApiOperation(\"查询bannerInter\")\n    @PreAuthorize(\"@el.check('sysUsersJobs:list')\")\n    public ResponseEntity<PageResult<SysUsersJobsDto>> querySysUsersJobs(SysUsersJobsQueryCriteria criteria, Pageable pageable){\n        return new ResponseEntity<>(sysUsersJobsService.queryAll(criteria,pageable),HttpStatus.OK);\n    }\n\n    @PostMapping\n    @Log(\"新增bannerInter\")\n    @ApiOperation(\"新增bannerInter\")\n    @PreAuthorize(\"@el.check('sysUsersJobs:add')\")\n    public ResponseEntity<Object> createSysUsersJobs(@Validated @RequestBody SysUsersJobs resources){\n        sysUsersJobsService.create(resources);\n        return new ResponseEntity<>(HttpStatus.CREATED);\n    }\n\n    @PutMapping\n    @Log(\"修改bannerInter\")\n    @ApiOperation(\"修改bannerInter\")\n    @PreAuthorize(\"@el.check('sysUsersJobs:edit')\")\n    public ResponseEntity<Object> updateSysUsersJobs(@Validated @RequestBody SysUsersJobs resources){\n        sysUsersJobsService.update(resources);\n        return new ResponseEntity<>(HttpStatus.NO_CONTENT);\n    }\n\n    @DeleteMapping\n    @Log(\"删除bannerInter\")\n    @ApiOperation(\"删除bannerInter\")\n    @PreAuthorize(\"@el.check('sysUsersJobs:del')\")\n    public ResponseEntity<Object> deleteSysUsersJobs(@RequestBody Long[] ids) {\n        sysUsersJobsService.deleteAll(ids);\n        return new ResponseEntity<>(HttpStatus.OK);\n    }\n}"
  },
  {
    "name": "Service",
    "content": "/*\n*  Copyright 2024 Leafage\n*\n*  Licensed under the Apache License, Version 2.0 (the \"License\");\n*  you may not use this file except in compliance with the License.\n*  You may obtain a copy of the License at\n*\n*  http://www.apache.org/licenses/LICENSE-2.0\n*\n*  Unless required by applicable law or agreed to in writing, software\n*  distributed under the License is distributed on an \"AS IS\" BASIS,\n*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n*  See the License for the specific language governing permissions and\n*  limitations under the License.\n*/\npackage com.banner.service;\n\nimport com.banner.domain.SysUsersJobs;\nimport com.banner.service.dto.SysUsersJobsDto;\nimport com.banner.service.dto.SysUsersJobsQueryCriteria;\nimport org.springframework.data.domain.Pageable;\nimport java.util.Map;\nimport java.util.List;\nimport java.io.IOException;\nimport javax.servlet.http.HttpServletResponse;\nimport me.zhengjie.utils.PageResult;\n\n/**\n* @website https://eladmin.vip\n* @description 服务接口\n* @author robbie\n* @date 2024-08-31\n**/\npublic interface SysUsersJobsService {\n\n    /**\n    * 查询数据分页\n    * @param criteria 条件\n    * @param pageable 分页参数\n    * @return Map<String,Object>\n    */\n    PageResult<SysUsersJobsDto> queryAll(SysUsersJobsQueryCriteria criteria, Pageable pageable);\n\n    /**\n    * 查询所有数据不分页\n    * @param criteria 条件参数\n    * @return List<SysUsersJobsDto>\n    */\n    List<SysUsersJobsDto> queryAll(SysUsersJobsQueryCriteria criteria);\n\n    /**\n     * 根据ID查询\n     * @param jobId ID\n     * @return SysUsersJobsDto\n     */\n    SysUsersJobsDto findById(Long jobId);\n\n    /**\n    * 创建\n    * @param resources /\n    */\n    void create(SysUsersJobs resources);\n\n    /**\n    * 编辑\n    * @param resources /\n    */\n    void update(SysUsersJobs resources);\n\n    /**\n    * 多选删除\n    * @param ids /\n    */\n    void deleteAll(Long[] ids);\n\n    /**\n    * 导出数据\n    * @param all 待导出的数据\n    * @param response /\n    * @throws IOException /\n    */\n    void download(List<SysUsersJobsDto> all, HttpServletResponse response) throws IOException;\n}"
  },
  {
    "name": "ServiceImpl",
    "content": "/*\n*  Copyright 2024 Leafage\n*\n*  Licensed under the Apache License, Version 2.0 (the \"License\");\n*  you may not use this file except in compliance with the License.\n*  You may obtain a copy of the License at\n*\n*  http://www.apache.org/licenses/LICENSE-2.0\n*\n*  Unless required by applicable law or agreed to in writing, software\n*  distributed under the License is distributed on an \"AS IS\" BASIS,\n*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n*  See the License for the specific language governing permissions and\n*  limitations under the License.\n*/\npackage com.banner.service.impl;\n\nimport com.banner.domain.SysUsersJobs;\nimport me.zhengjie.utils.ValidationUtil;\nimport me.zhengjie.utils.FileUtil;\nimport lombok.RequiredArgsConstructor;\nimport com.banner.repository.SysUsersJobsRepository;\nimport com.banner.service.SysUsersJobsService;\nimport com.banner.service.dto.SysUsersJobsDto;\nimport com.banner.service.dto.SysUsersJobsQueryCriteria;\nimport com.banner.service.mapstruct.SysUsersJobsMapper;\nimport org.springframework.stereotype.Service;\nimport org.springframework.transaction.annotation.Transactional;\nimport cn.hutool.core.lang.Snowflake;\nimport cn.hutool.core.util.IdUtil;\nimport org.springframework.data.domain.Page;\nimport org.springframework.data.domain.Pageable;\nimport me.zhengjie.utils.PageUtil;\nimport me.zhengjie.utils.QueryHelp;\nimport java.util.List;\nimport java.util.Map;\nimport java.io.IOException;\nimport javax.servlet.http.HttpServletResponse;\nimport java.util.ArrayList;\nimport java.util.LinkedHashMap;\nimport me.zhengjie.utils.PageResult;\n\n/**\n* @website https://eladmin.vip\n* @description 服务实现\n* @author robbie\n* @date 2024-08-31\n**/\n@Service\n@RequiredArgsConstructor\npublic class SysUsersJobsServiceImpl implements SysUsersJobsService {\n\n    private final SysUsersJobsRepository sysUsersJobsRepository;\n    private final SysUsersJobsMapper sysUsersJobsMapper;\n\n    @Override\n    public PageResult<SysUsersJobsDto> queryAll(SysUsersJobsQueryCriteria criteria, Pageable pageable){\n        Page<SysUsersJobs> page = sysUsersJobsRepository.findAll((root, criteriaQuery, criteriaBuilder) -> QueryHelp.getPredicate(root,criteria,criteriaBuilder),pageable);\n        return PageUtil.toPage(page.map(sysUsersJobsMapper::toDto));\n    }\n\n    @Override\n    public List<SysUsersJobsDto> queryAll(SysUsersJobsQueryCriteria criteria){\n        return sysUsersJobsMapper.toDto(sysUsersJobsRepository.findAll((root, criteriaQuery, criteriaBuilder) -> QueryHelp.getPredicate(root,criteria,criteriaBuilder)));\n    }\n\n    @Override\n    @Transactional\n    public SysUsersJobsDto findById(Long jobId) {\n        SysUsersJobs sysUsersJobs = sysUsersJobsRepository.findById(jobId).orElseGet(SysUsersJobs::new);\n        ValidationUtil.isNull(sysUsersJobs.getJobId(),\"SysUsersJobs\",\"jobId\",jobId);\n        return sysUsersJobsMapper.toDto(sysUsersJobs);\n    }\n\n    @Override\n    @Transactional(rollbackFor = Exception.class)\n    public void create(SysUsersJobs resources) {\n        Snowflake snowflake = IdUtil.createSnowflake(1, 1);\n        resources.setJobId(snowflake.nextId()); \n        sysUsersJobsRepository.save(resources);\n    }\n\n    @Override\n    @Transactional(rollbackFor = Exception.class)\n    public void update(SysUsersJobs resources) {\n        SysUsersJobs sysUsersJobs = sysUsersJobsRepository.findById(resources.getJobId()).orElseGet(SysUsersJobs::new);\n        ValidationUtil.isNull( sysUsersJobs.getJobId(),\"SysUsersJobs\",\"id\",resources.getJobId());\n        sysUsersJobs.copy(resources);\n        sysUsersJobsRepository.save(sysUsersJobs);\n    }\n\n    @Override\n    public void deleteAll(Long[] ids) {\n        for (Long jobId : ids) {\n            sysUsersJobsRepository.deleteById(jobId);\n        }\n    }\n\n    @Override\n    public void download(List<SysUsersJobsDto> all, HttpServletResponse response) throws IOException {\n        List<Map<String, Object>> list = new ArrayList<>();\n        for (SysUsersJobsDto sysUsersJobs : all) {\n            Map<String,Object> map = new LinkedHashMap<>();\n            list.add(map);\n        }\n        FileUtil.downloadExcel(list, response);\n    }\n}"
  },
  {
    "name": "Repository",
    "content": "/*\n*  Copyright 2024 Leafage\n*\n*  Licensed under the Apache License, Version 2.0 (the \"License\");\n*  you may not use this file except in compliance with the License.\n*  You may obtain a copy of the License at\n*\n*  http://www.apache.org/licenses/LICENSE-2.0\n*\n*  Unless required by applicable law or agreed to in writing, software\n*  distributed under the License is distributed on an \"AS IS\" BASIS,\n*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n*  See the License for the specific language governing permissions and\n*  limitations under the License.\n*/\npackage com.banner.repository;\n\nimport com.banner.domain.SysUsersJobs;\nimport org.springframework.data.jpa.repository.JpaRepository;\nimport org.springframework.data.jpa.repository.JpaSpecificationExecutor;\n\n/**\n* @website https://eladmin.vip\n* @author robbie\n* @date 2024-08-31\n**/\npublic interface SysUsersJobsRepository extends JpaRepository<SysUsersJobs, Long>, JpaSpecificationExecutor<SysUsersJobs> {\n}"
  }
]

export const tablesHandlers = [
  http.get('/api/tables/:id/codes', ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(codes)
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get('/api/tables/:id/columns', ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(columnDatas)
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get('/api/tables/:id', ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(datas.filter(item => item.id === Number(id))[0])
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get('/api/tables', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const size = url.searchParams.get('size')
    // Construct a JSON response with the list of all Row
    // as the response body.
    const data = {
      content: Array.from(datas.slice((Number(page) - 1) * Number(size), Number(page) * Number(size))),
      totalElements: datas.length
    }

    return HttpResponse.json(data)
  }),
  http.delete('/api/tables/:id', ({ params }) => {
    // All request path params are provided in the "params"
    // argument of the response resolver.
    const { id } = params

    // Let's attempt to grab the Row by its ID.
    const deletedData = datas.filter(item => item.id === Number(id))

    // Respond with a "404 Not Found" response if the given
    // Row ID does not exist.
    if (!deletedData) {
      return new HttpResponse(null, { status: 404 })
    }

    // Delete the Row from the "allRow" map.
    datas.pop()

    // Respond with a "200 OK" response and the deleted Row.
    return HttpResponse.json(deletedData)
  })
]
